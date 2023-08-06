/* eslint-disable capitalized-comments */
const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { postCard, fetchBinder, getPrettyBinderSummary, addCard, removeCard, pushBinder } = require('../utils/cards');
const { parseInt64, toString64, getCurrentTimestamp, clamp, objectToListMap } = require('../utils/math');
const { currentSet } = require('../utils/info');
const { getDefaultEmbed } = require('../utils/stringy');
const { cardTradeSessions } = require('../utils/db');
// const cardDrop = require('../events/cardDrop');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cardtest')
		.setDescription('Simple card test command')
		.addSubcommand(subcommand =>
			subcommand
				.setName('binder')
				.setDescription('View the cards you\'ve collected'),
		).addSubcommand(subcommand =>
			subcommand
				.setName('card')
				.setDescription('View a particular card')
				.addStringOption(option =>
					option
						.setName('name')
						.setDescription('Which card do you want to see?')
						.setRequired(true),
				),
		).addSubcommand(subcommand =>
			subcommand
				.setName('trade')
				.setDescription('Trade cards with another user')
				.addUserOption(option =>
					option
						.setName('player')
						.setDescription('Who would you like to trade with?')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'binder') {
			const binder = await fetchBinder(interaction.user.id);
			const summary = await getPrettyBinderSummary(currentSet, binder);
			const embed = getDefaultEmbed()
				.setTitle('Binder Contents')
				.setDescription(summary);
			await interaction.reply({ embeds: [embed] });
		} else if (interaction.options.getSubcommand() === 'card') {
			await interaction.reply(await postCard(currentSet, interaction.options.getString('name')));
		} else if (interaction.options.getSubcommand() === 'trade') {
			if (interaction.options.getUser('player').bot) await interaction.reply({ content: 'You can\'t trade with bots!', ephemeral: true });
			const target = interaction.options.getUser('player').id;
			let isDefault;
			let focusInitiator, focusTarget;

			const now = getCurrentTimestamp();
			const sessionID = [interaction.user.id, target, now].map(i => toString64(parseInt(i), 64)).join('.');
			const embed = getDefaultEmbed()
				.setTitle('⚠️ TRADE OFFER ⚠️')
				.setDescription('Configure your trade with the widgets below!');
			const yourCardSelect = new StringSelectMenuBuilder()
				.setCustomId(`binder_trade_${sessionID}_initiator_select`);
			const yourBinder = await fetchBinder(interaction.user.id);
			isDefault = true;
			for (const card in yourBinder[currentSet]) {
				yourCardSelect.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(card)
						.setValue(card)
						.setDefault(isDefault),
				);
				focusInitiator = isDefault ? card : focusInitiator;
				isDefault = isDefault && false;
			}

			const yourUpButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_initiator_up`)
				.setEmoji('⬆️')
				.setStyle(ButtonStyle.Primary);
			const yourDownButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_initiator_down`)
				.setEmoji('⬇️')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true);

			const yourCardSelectRow = new ActionRowBuilder()
				.addComponents(yourCardSelect);
			const yourCardSelectArrowRow = new ActionRowBuilder()
				.addComponents(yourUpButton, yourDownButton);


			const theirCardSelect = new StringSelectMenuBuilder()
				.setCustomId(`binder_trade_${sessionID}_target_select`);
			const theirBinder = await fetchBinder(target);
			isDefault = true;
			for (const card in theirBinder[currentSet]) {
				theirCardSelect.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(card)
						.setValue(card)
						.setDefault(isDefault),
				);
				focusTarget = isDefault ? card : focusTarget;
				isDefault = isDefault && false;
			}
			const theirUpButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_target_up`)
				.setEmoji('⬆️')
				.setStyle(ButtonStyle.Primary);
			const theirDownButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_target_down`)
				.setEmoji('⬇️')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true);

			const theirCardSelectRow = new ActionRowBuilder()
				.addComponents(theirCardSelect);
			const theirCardSelectArrowRow = new ActionRowBuilder()
				.addComponents(theirUpButton, theirDownButton);

			const confirmButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_system_confirm`)
				.setEmoji('✅')
				.setStyle(ButtonStyle.Success)
				.setDisabled(true);
			const cancelButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_system_cancel`)
				.setEmoji('🗑️')
				.setStyle(ButtonStyle.Danger);

			yourCardSelectArrowRow.addComponents(cancelButton);
			theirCardSelectArrowRow.addComponents(confirmButton);

			cardTradeSessions[sessionID] = { offer: {}, payment: {}, initiatorFocus: focusInitiator, targetFocus: focusTarget, closing: false };
			console.log(cardTradeSessions);
			const response = await interaction.reply({ embeds: [embed], components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow] });

			const buttonCollector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });
			buttonCollector.on('collect', async buttonInteraction => {
				const [, , bSession, bTrader, bDirection] = buttonInteraction.customId.split('_');
				if (buttonInteraction.user.id === interaction.user.id) {
					console.log('Button Clicked: ', buttonInteraction);
					console.log(bSession, bTrader, bDirection);
					if (!cardTradeSessions[bSession]) {
						response.edit({ embeds: [], components: [], content: 'Sorry, this trade request went stale and is no longer valid.' });
						return;
					}
					if (bTrader === 'system') {
						if (bDirection === 'cancel') {
							buttonInteraction.update({ embeds: [], components: [], content: 'Trade canceled!' });
							delete cardTradeSessions[bSession];
							return;
						} else if (bDirection === 'confirm') {
							if (!cardTradeSessions[bSession]['closing']) {
								cardTradeSessions[bSession]['closing'] = true;
								yourUpButton.setDisabled(true);
								yourDownButton.setDisabled(true);
								theirUpButton.setDisabled(true);
								theirDownButton.setDisabled(true);
								await buttonInteraction.update({ components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow], content: 'A button was clicked.' });
								return;
							} else {
								await buttonInteraction.reply({ content: 'Be patient! It\'s their turn to consider the offer.', ephemeral: true });
								return;
							}
						}
					} else {
						const bDecider = bTrader === 'initiator';
						const [bInitiator, bTarget, ,] = bSession.split('.').map(x => parseInt64(x, 64));
						const bBinder = await fetchBinder(bDecider ? bInitiator : bTarget);
						const bFocus = cardTradeSessions[bSession][bDecider ? 'initiatorFocus' : 'targetFocus'];
						const bDealSide = bDecider ? 'offer' : 'payment';
						const bNewValue = (cardTradeSessions[bSession][bDealSide][bFocus] ?? 0) + (bDirection === 'up' ? 1 : -1);
						console.log(bDecider, bTrader, bInitiator, bTarget, bBinder, bFocus, bDealSide, bNewValue);
						clamp(bNewValue, 0, bBinder[currentSet][bFocus]);
						(bDecider ? yourUpButton : theirUpButton).setDisabled(bNewValue === bBinder[currentSet][bFocus]);
						(bDecider ? yourDownButton : theirDownButton).setDisabled(bNewValue === 0);
						console.log(cardTradeSessions[bSession]['offer']);
						cardTradeSessions[bSession][bDealSide][bFocus] = bNewValue;
						let bYourOfferString = objectToListMap(Object.entries(cardTradeSessions[bSession]['offer']), (i) => (i[1] > 0 ? `- ${i[0]} x${i[1]}` : '')).filter(i => i.length).join('\n');
						let bTheirOfferString = objectToListMap(Object.entries(cardTradeSessions[bSession]['payment']), (i) => (i[1] > 0 ? `- ${i[0]} x${i[1]}` : '')).filter(i => i.length).join('\n');
						confirmButton.setDisabled(!(bYourOfferString.length + bTheirOfferString.length));
						if (!bYourOfferString.length) bYourOfferString = '- nothing';
						if (!bTheirOfferString.length) bTheirOfferString = '- nothing';

						const bTradeDescription = `YOU receive:\n${bTheirOfferString}\n\nTHEY receive:\n${bYourOfferString}`;
						const bEmbed = getDefaultEmbed()
							.setTitle('⚠️ TRADE OFFER ⚠️')
							.setDescription(bTradeDescription);
						console.log(Object.keys(response.interaction));
						await buttonInteraction.update({ embeds: [bEmbed], components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow], content: 'A button was clicked.' });
						console.log(cardTradeSessions);
					}
				} else if (buttonInteraction.user.id === target) {
					if (bDirection === 'confirm') {
						if (cardTradeSessions[bSession]['closing']) {
							for (const i in cardTradeSessions[bSession]['offer']) {
								console.log(`Paying ${i} x${cardTradeSessions[bSession]['offer'][i]}...`);
								console.log('=========\n', yourBinder, theirBinder);
								removeCard(yourBinder, currentSet, i, cardTradeSessions[bSession]['offer'][i]);
								addCard(theirBinder, currentSet, i, cardTradeSessions[bSession]['offer'][i]);
								console.log('\n', yourBinder, theirBinder, '\n=========\n\n');
							}
							for (const i in cardTradeSessions[bSession]['payment']) {
								console.log(`Receiving ${i} x${cardTradeSessions[bSession]['payment'][i]}...`);
								console.log('////////////////\n', yourBinder, theirBinder);
								removeCard(theirBinder, currentSet, i, cardTradeSessions[bSession]['payment'][i]);
								addCard(yourBinder, currentSet, i, cardTradeSessions[bSession]['payment'][i]);
								console.log('\n', yourBinder, theirBinder, '\n////////////////\n\n');
							}
							await pushBinder(interaction.user.id, yourBinder);
							await pushBinder(target, theirBinder);
							delete cardTradeSessions[bSession];
							await buttonInteraction.update({ embeds: [], components: [], content: 'Deal sealed! Enjoy your cards!' });
							return;
						} else {
							await buttonInteraction.reply({ content: 'Be patient! The offer\'s still being set up.', ephemeral: true });
							return;
						}
					}
				} else {
					await buttonInteraction.reply({ content: 'Those buttons aren\'t for you! Shoo, shoo!', ephemeral: true });
					return;
				}
			});

			const selectCollector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time:3_600_000 });
			selectCollector.on('collect', async selectInteraction => {
				if (selectInteraction.user.id === interaction.user.id) {
					console.log('Item Selected: ', selectInteraction);
					const [, , sSession, sTrader, ,] = selectInteraction.customId.split('_');
					const sDecider = sTrader === 'initiator';
					const [sInitiator, sTarget, ,] = sSession.split('.').map(x => parseInt64(x, 64));
					const sChoice = selectInteraction.values[0];
					cardTradeSessions[sSession][sDecider ? 'initiatorFocus' : 'targetFocus'] = sChoice;
					if (sDecider) {
						yourCardSelect.setOptions();
						for (const card in yourBinder[currentSet]) {
							yourCardSelect.addOptions(
								new StringSelectMenuOptionBuilder()
									.setLabel(card)
									.setValue(card)
									.setDefault(card === sChoice),
							);
						}
					} else {
						theirCardSelect.setOptions();
						for (const card in theirBinder[currentSet]) {
							yourCardSelect.addOptions(
								new StringSelectMenuOptionBuilder()
									.setLabel(card)
									.setValue(card)
									.setDefault(card === sChoice),
							);
						}
					}
					const sBinder = await fetchBinder(sDecider ? sInitiator : sTarget);
					const sDealSide = sDecider ? 'offer' : 'payment';
					(sDecider ? yourUpButton : theirUpButton).setDisabled((cardTradeSessions[sSession][sDealSide][sChoice] ?? 0) === sBinder[currentSet][sChoice]);
					(sDecider ? yourDownButton : theirDownButton).setDisabled((cardTradeSessions[sSession][sDealSide][sChoice] ?? 0) === 0);
					await selectInteraction.update({ components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow], content: 'An option was selected.' });
				} else {
					await selectInteraction.reply({ content: 'Those dropdowns aren\'t for you! Shoo, shoo!', ephemeral: true });
				}
			});
		}
	},
};