/* eslint-disable capitalized-comments */
const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { postCard, fetchBinder, getPrettyBinderSummary, addCard, removeCard, pushBinder, clearEmptiesInBinder, checkSessionConflict, SessionStatus } = require('../utils/cards');
const { parseInt64, toString64, getCurrentTimestamp, clamp, objectToListMap } = require('../utils/math');
const { currentSet } = require('../utils/info');
const { getDefaultEmbed } = require('../utils/stringy');
const { cardTradeSessions } = require('../utils/db');

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
		// Player wants to see their binder contents
		if (interaction.options.getSubcommand() === 'binder') {
			const binder = await fetchBinder(interaction.user.id);
			const summary = await getPrettyBinderSummary(currentSet, binder);
			const embed = getDefaultEmbed()
				.setTitle('Binder Contents')
				.setDescription(summary);
			await interaction.reply({ embeds: [embed] });
		// Dev wants to view a particular card
		} else if (interaction.options.getSubcommand() === 'card') {
			await interaction.reply(await postCard(currentSet, interaction.options.getString('name')));
		// Player wants to trade with someone else
		} else if (interaction.options.getSubcommand() === 'trade') {
			const targetPlayer = interaction.options.getUser('player');
			const initiatingPlayer = interaction.user;
			// No trades with bots
			if (targetPlayer.bot) {
				await interaction.reply({ content: 'You can\'t trade with bots!', ephemeral: true });
				return;
			}
			if (targetPlayer.id === initiatingPlayer.id) {
				await interaction.reply({ content: 'You can\'t trade with yourself!', ephemeral: true });
				return;
			}

			// Block new sessions where either participant is busy
			const sessionInfo = checkSessionConflict(initiatingPlayer, targetPlayer);
			if (sessionInfo === SessionStatus.InitiatorBusy) {
				await interaction.reply({ content: 'You\'re already busy with another trade!', ephemeral: true });
				return;
			}
			if (sessionInfo === SessionStatus.TargetBusy) {
				await interaction.reply({ content: 'Your target trade partner is currently busy trading with someone else!', ephemeral: true });
				return;
			}
			// Collect information
			let isDefault;
			let focusInitiator, focusTarget;

			// Initialize session details
			const now = getCurrentTimestamp();
			const sessionID = [interaction.user.id, targetPlayer.id, now].map(i => toString64(parseInt(i), 64)).join('.');

			// Begin constructing embed, buttons
			const embed = getDefaultEmbed()
				.setTitle('⚠️ TRADE OFFER ⚠️')
				.setDescription('Configure your trade with the widgets below!');
			const yourCardSelect = new StringSelectMenuBuilder()
				.setCustomId(`binder_trade_${sessionID}_initiator_select`);
			/*
				Because of the way Discord's API works, string select menus don't persist
				between clicks by default. Each time an option is selected, the select box's
				default option must be changed. This confers the illusion of a persistent menu.
			*/

			// ========
			// Setup for dealmaker's side
			// ========
			// Binder collection / outgoing select menu
			const yourBinder = await fetchBinder(initiatingPlayer.id);
			const initiatorHasCards = yourBinder[currentSet] && Object.keys(yourBinder[currentSet]).length > 0;
			isDefault = true;
			for (const card in initiatorHasCards ? yourBinder[currentSet] : { 'No cards!': 0 }) {
				yourCardSelect.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(card)
						.setValue(card)
						.setDefault(isDefault),
				);
				// No if statement here.
				// Optimization to prevent incorrect branching at machine level
				// TODO does this actually make a difference?
				focusInitiator = isDefault ? card : focusInitiator;
				isDefault = isDefault && false;
			}

			// Up/Down buttons
			const yourUpButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_initiator_up`)
				.setEmoji('⬆️')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(!initiatorHasCards);
			const yourDownButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_initiator_down`)
				.setEmoji('⬇️')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true);

			// Adding components to rows
			const yourCardSelectRow = new ActionRowBuilder()
				.addComponents(yourCardSelect);
			const yourCardSelectArrowRow = new ActionRowBuilder()
				.addComponents(yourUpButton, yourDownButton);

			// ========
			// Setup for target's side
			// ========

			// Binder collection / incoming select menu
			const theirCardSelect = new StringSelectMenuBuilder()
				.setCustomId(`binder_trade_${sessionID}_target_select`);
			const theirBinder = await fetchBinder(targetPlayer.id);
			const targetHasCards = theirBinder[currentSet] && Object.keys(theirBinder[currentSet]).length > 0;
			isDefault = true;
			for (const card in targetHasCards ? theirBinder[currentSet] : { 'No cards!': 0 }) {
				theirCardSelect.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(card)
						.setValue(card)
						.setDefault(isDefault),
				);
				focusTarget = isDefault ? card : focusTarget;
				isDefault = isDefault && false;
			}

			// Up/Down buttons
			const theirUpButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_target_up`)
				.setEmoji('⬆️')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(!targetHasCards);
			const theirDownButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_target_down`)
				.setEmoji('⬇️')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(true);

			// Adding components to rows
			const theirCardSelectRow = new ActionRowBuilder()
				.addComponents(theirCardSelect);
			const theirCardSelectArrowRow = new ActionRowBuilder()
				.addComponents(theirUpButton, theirDownButton);

			// Confirm and cancel buttons
			const confirmButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_system_confirm`)
				.setEmoji('✅')
				.setStyle(ButtonStyle.Success)
				.setDisabled(true);
			const cancelButton = new ButtonBuilder()
				.setCustomId(`binder_trade_${sessionID}_system_cancel`)
				.setEmoji('🗑️')
				.setStyle(ButtonStyle.Danger);

			// Adding buttons to different rows
			yourCardSelectArrowRow.addComponents(cancelButton);
			theirCardSelectArrowRow.addComponents(confirmButton);

			// Push session to global session tracker
			cardTradeSessions[sessionID] = { offer: {}, payment: {}, initiatorFocus: focusInitiator, targetFocus: focusTarget, closing: false };
			// Respond to player command with embed
			// TODO Defer reply
			const response = await interaction.reply({ embeds: [embed], components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow] });

			// ========
			// Set up collectors
			// ========
			const buttonCollector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });
			buttonCollector.on('collect', async buttonInteraction => {
				const [, , bSession, bTrader, bDirection] = buttonInteraction.customId.split('_');
				// Most interactions are available only to the calling user
				if (buttonInteraction.user.id === initiatingPlayer.id) {
					if (!cardTradeSessions[bSession]) {
						// TODO test if this message actually plays after a reboot
						response.edit({ embeds: [], components: [], content: 'Sorry, this trade request went stale and is no longer valid.' });
						return;
					}
					if (bTrader === 'system') {
						if (bDirection === 'cancel') {
							buttonInteraction.update({ embeds: [], components: [], content: 'Trade canceled by initiator!' });
							delete cardTradeSessions[bSession];
							return;
						} else if (bDirection === 'confirm') {
							if (!cardTradeSessions[bSession]['closing']) {
								cardTradeSessions[bSession]['closing'] = true;
								yourUpButton.setDisabled(true);
								yourDownButton.setDisabled(true);
								theirUpButton.setDisabled(true);
								theirDownButton.setDisabled(true);
								await buttonInteraction.update({ components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow] });
								return;
							} else {
								await buttonInteraction.reply({ content: 'Be patient! It\'s their turn to consider the offer.', ephemeral: true });
								return;
							}
						}
					} else {
						// TODO Functionalize this?
						const bDecider = bTrader === 'initiator';
						const [bInitiator, bTarget, ,] = bSession.split('.').map(x => parseInt64(x, 64));
						const bBinder = await fetchBinder(bDecider ? bInitiator : bTarget);
						const bFocus = cardTradeSessions[bSession][bDecider ? 'initiatorFocus' : 'targetFocus'];
						const bDealSide = bDecider ? 'offer' : 'payment';
						const bNewValue = clamp((cardTradeSessions[bSession][bDealSide][bFocus] ?? 0) + (bDirection === 'up' ? 1 : -1), 0, bBinder[currentSet][bFocus]);
						(bDecider ? yourUpButton : theirUpButton).setDisabled(bNewValue === bBinder[currentSet][bFocus]);
						(bDecider ? yourDownButton : theirDownButton).setDisabled(bNewValue === 0);
						clearEmptiesInBinder(yourBinder);
						clearEmptiesInBinder(theirBinder);
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
						await buttonInteraction.update({ embeds: [bEmbed], components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow] });
					}
				} else if (buttonInteraction.user.id === targetPlayer.id) {
					if (bTrader === 'system') {
						if (bDirection === 'cancel') {
							buttonInteraction.update({ embeds: [], components: [], content: 'Trade canceled by target!' });
							delete cardTradeSessions[bSession];
							return;
						}
					}
					if (bDirection === 'confirm') {
						if (cardTradeSessions[bSession]['closing']) {
							for (const i in cardTradeSessions[bSession]['offer']) {
								// TODO functionalize card transfer in cards.js?
								removeCard(yourBinder, currentSet, i, cardTradeSessions[bSession]['offer'][i]);
								addCard(theirBinder, currentSet, i, cardTradeSessions[bSession]['offer'][i]);
							}
							for (const i in cardTradeSessions[bSession]['payment']) {
								removeCard(theirBinder, currentSet, i, cardTradeSessions[bSession]['payment'][i]);
								addCard(yourBinder, currentSet, i, cardTradeSessions[bSession]['payment'][i]);
							}
							clearEmptiesInBinder(yourBinder);
							clearEmptiesInBinder(theirBinder);
							await pushBinder(initiatingPlayer.id, yourBinder);
							await pushBinder(targetPlayer.id, theirBinder);
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
				if (selectInteraction.user.id === initiatingPlayer.id) {
					const [, , sSession, sTrader, ,] = selectInteraction.customId.split('_');
					const sDecider = sTrader === 'initiator';
					const [sInitiator, sTarget, ,] = sSession.split('.').map(x => parseInt64(x, 64));
					const sChoice = selectInteraction.values[0];
					cardTradeSessions[sSession][sDecider ? 'initiatorFocus' : 'targetFocus'] = sChoice;
					// TODO ternarize this, like on the line before the update statement
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
							theirCardSelect.addOptions(
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
					// Update all components with changes
					await selectInteraction.update({ components: [yourCardSelectRow, yourCardSelectArrowRow, theirCardSelectRow, theirCardSelectArrowRow] });
				} else {
					await selectInteraction.reply({ content: 'Those dropdowns aren\'t for you! Shoo, shoo!', ephemeral: true });
				}
			});
		}
	},
};