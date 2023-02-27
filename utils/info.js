const colorDict = {
	RUST: 0xa00103,
	BRONZE: 0xa25203,
	GOLD: 0xcfcd00,
	LIME: 0x6ace00,
	OLIVE: 0x517600,
	JADE: 0x009358,
	TEAL: 0x009294,
	CERULEAN: 0x004182,
	INDIGO: 0x000082,
	PURPLE: 0x460984,
	VIOLET: 0x7e1a7d,
	FUCHSIA: 0x99004d,
	BREATH: 0x47dff9,
	LIFE: 0x90eb34,
	LIGHT: 0xf6fa4e,
	TIME: 0xff2106,
	HEART: 0xbd1864,
	RAGE: 0x9c4dad,
	BLOOD: 0xba1016,
	DOOM: 0x202020,
	VOID: 0x002684,
	SPACE: 0xf3fdff,
	MIND: 0x06ffc9,
	HOPE: 0xfcdd91,
	PROSPIT: 0xfff434,
	DERSE: 0xde00ff,
	BOT: 0x716f81,
	SAUSAGE_UPDATE: 0x51a3a3,
	HELP_COMMAND: 0xa20000,
	TROLL_COMMAND: 0xc6b4ce,
	OTHER: 0xade196,
	ORGANIZATIONS: 0xff0100,
	KID: 0x7bafde,
};

const docDict = {
	SNS: '1s00GvbGKS6gW3Dl1K1qMk3TSMQ1x-o-jnYhq_PODBks',
	RUST: '1HI2-2sDqiZf2cdihOXaT3pCQy17WCb2dht1xyb6Qyh0',
	BRONZE: '1V-L2zj6hoaqTlbqUTZykS9APV9lDjS0bzzyVVsRtheU',
	GOLD: '17yDtxxtKY9Y1lbZCmzBKjEvFWffF6QGpbQlTu-DPH5E',
	LIME: '1uHiKIoebqbodgI7H7YUVMPVI2A2hn6yIp4sQdJ4J1pY',
	OLIVE: '1TMG3hOR_Ffq3XrWQCou12_vFZqtD78E59E0Ay6Juw40',
	JADE: '1vmX39EB4JHD7JygxfAdGVIJODglNDCnJlOhyDNJkpAs',
	TEAL: '1HBuvpFbaFsvuscJ7X3bAp07KWcThBN5jJAtxWJVDsaY',
	BLUE: '18TnW-GMLhw5KI9KKyJVUDq1MEojs47NIxSDLTlEMa3Y',
	INDIGO: '1-wzVuWZjtfoV1fVrQOj5ZdLBdWNQrxb7V0YHnIcorMg',
	PURPLE: '16RIH87fHGoeoTIEcfJwcSCiAuVPRWvolt_2QDuH4pFQ',
	VIOLET: '1Takp27Ui58wU446DcSmNYreNSZxuOC2hWYJILMTxZU4',
	FUSCHIA: '1X7GB0micWDDS33VX6qBdOPjz6h0dw8vTIgDenPjpe3I',
	KID: '1eS0e5O6pYcPWH790uyszB4phST9m1sFEABPfg97AuMk',
	PROSPIT: '1pBeHPaN4FGXgGpPPf5hdy_uJ6DFaxNn9XajRBc8TGMc',
	DERSE: '1785P9AG-dtSwBXifxc34BfjLQGCX6mAZe6w3Den00m4',
	TIME: '1zODV-woWr1ei2i4cJagfMqEvqWyCuLbaga6loIliBiE',
	SPACE: '1VRD7c4p3f9jXeNluLlkYvjH-3jazl4cIigreMhklhwQ',
	LIFE: '1j62KATR-I--n_cl5xrCJ-lF8-oNUBDVx7bAx8qzJi48',
	DOOM: '1KFG7K6qaUx9k7WWaUelRCtZVWXaabffJVFFXrxzGq_M',
	HOPE: '18aQ7U132c_zXVl0GCQfOS62VMm4RQIiELiC7Kz5tqgk',
	RAGE: '15yGDTKg0A3ne5NcjbFbEog8KtKUdXuytEmNjVgfiCL4',
	BREATH: '1MPLla4CcrB95JkCBg1gqBMJxWY4SLkWszshg4M4Kd6s',
	BLOOD: '1MlYMacXMlmHTZhT1oVShKeAImoJQYN0hJ3BTomKo5zM',
	LIGHT: '17Tjv4CLrPxYPzx36F2iOsMCITzc2qPs1lmvTOCMe95w',
	VOID: '1r4_G-vCX4i05NJgW_RQe7HgaUP9PaD8JNvgWTyO06Bg',
	HEART: '1RUKxbOR2GPK4-ElNkYtapuRAJM7ypin5XVrkNQ4Ay6o',
	MIND: '1RnekDohUu5mnzAuYtcU_4q3JMSizNNfGO1JGC7byMIE',
	MAID: '1ivTnKcpLsXQEoykglOXq9rP8GPpcerEhmf9bhHlkgtQ',
	SYLPH: '1k92GeH7Ka19KFmVu8-uxecYX9q4G8lDu3QD4AOg7mQI',
	KNIGHT: '1UU7RzHnjGNJBOg-cTAJ8GR__tILDQpK9hFiWHre55Ko',
	PAGE: '1pkvxaY-fVDZcXIommt3OFbZWyRdM6IiOQbkr_w6k_pA',
	WITCH: '1cCrzZjGfhbP-PQT01jGXZ6pbadVkWzfboOyjDOh5qzA',
	HEIR: '1QhfW6nGpKKuJHRLlgHgnNiec_pcqARGyKb8vwmqZDgQ',
	MAGE: '1RTfsDRQPtfELFjaaEuYRSNcPok3AP6ujy_iOVLeHAFs',
	SEER: '1M4a8DVpgRybnWOI2jwJUVDJfzU0zr-yFBZzid3_MMHA',
	THIEF: '1vHD5F3tK-_dDc-7LsVZohzGINoCOSvcAfY0qQLXV9Ic',
	ROGUE: '18PwTmrOr8QRXtI-wPyCZMPn-AnqrliD8jzyKt5nQ2ck',
	PRINCE: '1S8jzmRMKbqAx10hzb2UgYu42s1JsZyLEZjmnmuycnRE',
	BARD: '1zN1qhtUbjuUkB8d18FtKYLKKwxWQ0hiJWZRB2mLC-0o',
	GENERIC: '1_ekvclk77Zc1akQBAAb00z07h8mklSs-zZFjgIahVws',
	MUTANT: '1uuqkmtRUEuSAhx1MFb7TIkeW9mV2ryg6YyefksHj-bw',
	ADULT: '1lGRHNVzuDrjZ__LskHJp6i1tAjRY0ZktvZ6OJpIECz8',
	ABOMINARTIST: '1dEiSw7AROhy1ZUaqgXjJrHbZqVODcZoqImvWeXC1TtA',
	ASTROSORCERER: '1RBZRyzgCLhVTH5GmeD7qV3Hg8gB9GIasMIMZ2Awpk9Y',
	BEAST_BRAWLER: '1MhQYI9qJ9XaX2wZAupMdiUR9uXMU9m-XeZWBSwLV7Dk',
	SERVICESQUIRE: '1TUfz5kFpAS6pETW3zCuu9CQq1q2Xkha-SBc334YWgW8',
	CTHONOMANCER: '1vx41sEUTrJ64gGZa2pMeebLw6g0UCdkJS7rho_bN2PM',
	DOCTERROR: '1JEFH1doxGYgnRMPfWFNmEYqUgouZzkJYxBmF753gOtQ',
	FIDUSSPAWNER: '17cIWz-0x6LDxBGuc3WeRszGhUymgzk6XEyuQkluyEXI',
	GHOST: '1ZGeYLcrZxVdLSwARUkXhi-Mtr-2uCt2YEx7OJmwH3pc',
	GOREMAND: '10jRz9CQPfVZlAU7xBrvvjq1lZSmZtZOvJtOoNjAkV-s',
	GRIMDARK: '1ciKWrEImKbGTGPxmV9gmusZdZGo-pxYZsoPtvl6IDSU',
	HACKERMAN: '102Iq_q4lyoD7vuyN-RfXvjcTS_oo6YeAq6bfM4ZDqZQ',
	HEMOANON: '14Ln2BqcnFV9UKCxS8W3fhxQ-dRmsjwqbstIfyVi3lpQ',
	HAUTE_CLAWTURE: '1Hrm44btD9PX_LrMHmez0REfBScjY2mJlw5aCmsVb0tQ',
	HORTICULLTURIST: '1r85OD8R5mCBN12_3dFjPGp8tlWnOo1GoiY8lRyLvVdY',
	KIDS_ON_BIKES: '1jJ7dUZyeVBOhre8hcETkNjRCqkl-dS7zNKlBxVMdu60',
	MOONBARKS: '1M2ZWLBpjAV-f1aHdCHUAy2aHldYj3l69FGRYvRNE5aM',
	MUSICREANT: '1qxhgPemgSlVdwWwJO0dwE8ag5kI1HpyBMiBMBZWikP8',
	DECOMPOSITIONIST: '1la2G307I9MadP4_JQe_xmJfODZ5sX9QmJjGlyQHm4hk',
	RAINBOW_DRINKER: '14j5PZenxgUO9ltR6i-2YG9b3nl17ltuG-oNxfRgfh9U',
	ROBOT: '1iySresutxOnREXPp9wfrtbOuW8dNIju75qnZY2VZ_Gc',
	SHADOWDROPPER: '18ifelz4cUTE94rM_zmKZ-YoqJUlZTt_9j85ZUSrpHKw',
	SUPERSCOUNDREL: '1WtlLVkIeuf2m9qZUlafM1mL31rNGk9n29lQJLDouNgw',
	TRICKSTER: '1k_-D-LaDbwqM16jcKycUP-GEFqk90Onbt-kc5WBkP-k',
	VOIDROT: '1Rt5_mkDP46fLgqGxZ_-mn_VkYMzHbyWrEoQaRdPUwb0',
	CIS: '1LvFdjocNbS5pv58Ufq06ZDBbbGSxaPufPQbd7orz-Vc',
	HET: '1Iv_wg981cynrCXRZsU0iCNMS-6T-H8iUa-IZDxck9h4',
	TIT: '1ORhh7e84_B8yMVJ3DD4fcCccjUuPmD_dustce7VxlwI',
	CULLSCOUT: '1R6kRPmOWy0UNhj-pdg76ERAXqnVI0LsFA4-YB_e-Nx4',
	BUSTIN: '1arSqzzkBcbpJ-mOqAqA2y-dL76JLChur35G3Dibud_Q',
	ORPHANER: '1WFaDOUk80zfzCXtWZJZZbXMJvAN-czMWkVtDengKIaQ',
	HERO_MODE: '1L9OUQ92tjuuAwLzGeCpzc4qR97vGIaGGPZX1ZUhjBms',
	QUAD: '1JvWTVMUcCme5j7PPrsJCDkYHImlxxKdH8vBuk_hTuyg',
	DOWNTIME: '1nSrifxsHwf2yEJ_LovUNr6Bv-A4fKfzZM2v32tGMOuk',
	LUSUS: '1FKxzL8jBgIQomVAFaRqriZLce-R4aRNEBQ-Vtkeldq4',
	MONSTER: '1Whwq7ojyvDg50uZuQJS78mAh2RqZN5NHiFBhduJHDe8',
	RAIDBOSSES: '1dBHa4_PpRaBeye9QrQZH1U4lXTLjGbiqkpRJu6592ps',
	HAZARD: '1b9fifDxrlLnYN5Q7aw_PePq7LX8Xqxb_OB8indG04nw',
	AFFLICTION: '1vCfAGp7yjKReHNuMB0BX8Bl57inLdXHIejxqRylmj9I',
	SYLLADEX: '1X5Dwf99hfHR51O2A-3-15A20L2oqsLNTt4DkNY7IlTg',
	PROSTHETIC: '1ZuMFIP395PEegyIaowcRiB_o73-R3GTmxmUJXCcDUWA',
	FASHION: '1fn33SU6a1q8GvmvOyVZ14G43FiaeyYdm4Gj9NnzlS4I',
	VEHICLE: '1aMPzlLWXkrCarVHubGU5B5yRjOn7d9TVR6Yk-U6cqBs',
	WEAPON: '16wmz_rGeTTxLE4iuJRzI_yyZOW88pLoBmt5fFGJp95Y',
	HIVECRAFTING: '1vz_ydLE5NkPMbV_U5Stvzf5a4LrY5OJWmxk9NTlEoSY',
	TAG: '1jHTFk8n2MKpAbvpWzxZbZ-XBDu6tnHbJzFbLVNW1z0Y',
	STATUS: '19baxL--fUlTDFFN9UdDycKwQiDYDqDtsT8hym4YllmI',
	EMOTION: '1ZerAA3p5JibOVWzrWzRNQdJH0nlWEyqbw68nF89ugWg',
	CASTE_NPC: '1XBws-7Zdldt4pcW8j2BdQRJwcrUK-Ur_7ptkdNgkFFc',
	TEMPLATE_NPC: '1zdwZZeSdKHOLuaDxU_vxMnxFR86CvVHdD88_OHaruzo',
	PLANT: '1JfuwJZ8F2w5q9ZS-AYXUpwHoVsE9EB90xQ-isCwOILA',
	NPC_MONSTER: '1VHkYOLlll4PORat_6HzhZw4c_yVBP7ByfHV3om5JbaI',
	RAID_BOSS: '1dBHa4_PpRaBeye9QrQZH1U4lXTLjGbiqkpRJu6592ps',
	UNIVERSAL: '1wk2LG4tJqxv6He-R4EPBzYbfxKMxGGhwzEzCmsGev6Y',
	NADS: '1exSy8dqDVvMLgBKX5-5xcvlwNoLAKcF9h-964sfMheU',
	KOB: '1jJ7dUZyeVBOhre8hcETkNjRCqkl-dS7zNKlBxVMdu60',
	QUADRANT: '1JvWTVMUcCme5j7PPrsJCDkYHImlxxKdH8vBuk_hTuyg',
	TEARM_STRIFE: '1pcDDyiHJpwEFkaCTsvzI3b1KHA341hjdj9hrFynpU5o',
	PERFECTLY_GENERIC: '1_ekvclk77Zc1akQBAAb00z07h8mklSs-zZFjgIahVws',
	ABSTRATA: '16wmz_rGeTTxLE4iuJRzI_yyZOW88pLoBmt5fFGJp95Y',
	EFFECT: '19baxL--fUlTDFFN9UdDycKwQiDYDqDtsT8hym4YllmI',
};

const fanmadeLinks = [
	'**WARNING**: Modified character sheets are NOT accepted upon submission. Please use this as a secondary sheet, or after approval.\nhttps://docs.google.com/document/d/1A6259kYnzmpQ0uLnTmnCQ0XamS-2iOam1ztm8Wl-_do/edit',
	'https://docs.google.com/spreadsheets/d/17G_Er3M8nht6TBCKXk1197QLU7rFYZ5vryyD8IcUMis/edit#gid=0',
	'https://docs.google.com/spreadsheets/d/1kFfRbJ0KoTWPOPQO2uUWDu7SKCTAHNtIwuc1IDB2p1Q/edit#gid=0',
	'https://docs.google.com/spreadsheets/d/1NmJzZ5xV2qfiU7V8Gap80z26JSos_DWyGwxvcJg1nks/edit#gid=0',
	'https://docs.google.com/document/d/1SMzR8MkBWzHfmpwDfvn0bH3nMUbasgtURqw3CVDi68Y/edit',
	'https://docs.google.com/document/d/17UsdejnEdKgtgW0zQAjpvT-cJeyylfp-aIMmmN7zkVY/edit',
	'https://docs.google.com/document/d/1tlfH6U-mBLgN24zZgN-uhNvgC93uIwXBdTx4NgucaJg/edit',
	'https://docs.google.com/document/d/1USYiHluU3Auit1JsMG1Od7xJshCBNBdzN6_ZBsc_m2A/edit',
	'https://docs.google.com/spreadsheets/d/1LxWQF_To6Rpxj7uN0PGtBueDtovi582XxB4bouyGCcM/edit#gid=0',
	'https://docs.google.com/document/d/176L2QtGtsZf_mujAKssNmgQHmYZjCKcs9FApyvv63zc/edit',
	'https://docs.google.com/document/d/1_ifoRJ9xPof9Ka2ZRLw259dKT_ULKX41nocmLJeNbJg/edit',
	'https://docs.google.com/spreadsheets/d/1K5ETHwd6n9WbQlGKi6-M54Q-_qlI2SzfgI2Gm1aOay0/edit?usp=sharing',
	'https://mspaintadventures.fandom.com/wiki/Troll_language',
	'https://docs.google.com/document/d/1gq8z7gtfsAGI0-B0b3-PHz0JFokheneQ1YtNy7XQGU4/edit',
	'https://docs.google.com/document/d/1fQOHnW8HqXg4VoueNJEl83cx0cqMyUHdyIzPjKtpX8U/edit',
];

const tableNames = ['abstrata', 'affliction', 'downtime', 'effect', 'emotion', 'hazard', 'hivecrafting', 'lusus', 'monster', 'move', 'prosthetic', 'sylladex', 'tag', 'trollcall', 'vehicle'];
const lookupTableNames = ['abstrata', 'affliction', 'downtime', 'effect', 'emotion', 'hazard', 'hivecrafting', 'lusus', 'monster', 'move', 'prosthetic', 'sylladex', 'tag', 'vehicle'];

const birthdays = [];

const helpText = {
	'default':
`> Use \`/help <command>\` on any command with an * to learn more about it.

**Roleplay**
\`/fanmade <document>\` - Fetch a link to a fanmade document
\`/lookup\`* - Look up game information
\`/pinglist\`* - Manage and invoke pinglists
\`/roll\`* - Roll dice for S&S (and anything else)
\`/rules\` - Read the server rules
\`/starter\`* - Manage your trollcial post templates on mobile
\`/troll <name>\` - Look up a troll in the server troll call
\`/trollcall <user>\` - Look up a user's specific troll call

**Utilities**
\`/choose\`* - Randomly pick from a list of choices
\`/help <command>\` - Fetch additional help for complex* commands
\`/image <category>\` - Fetch a random image from a specific category
\`/invite\` - Fetch an invite link for Sausage
\`/version\` - Read Sausage version information

**Fun**
\`/breakdance\` - Do a little dance
\`/reminder\` - Remember to do the thing
\`/tipjar\` - Tip the devs!`,

	'lookup':
`\`/lookup <category> <key>\`
Valid categories are given in the dropdown menu and cover a vast swath of S&S reference documents.

By default, this command prints out the text of the requested key in a neatly formatted embed.

When using the \`move\` category, you may additionally request a listing of move titles with specific tags.
Here are some examples:
> \`rust passive\` - returns all [Passive][Rust] moves
> \`rust|time\` - returns all [Rust] OR [Time] moves
> \`rust !basic\` - returns all [Rust] moves which are NOT [Basic]
> \`rust basic|advanced\` - returns all [Rust] moves which are either [Basic] or [Advanced]`,

	'pinglist':
`\`/pinglist (create|invoke|delete) <name>\`

\`/pinglist create <name>\` - Creates a pinglist with the given name and posts a join/leave menu in the channel you posted in
\`/pinglist invoke <name>\` - Invokes the pinglist with the given name, pinging everyone on the list and posting a join/leave menu
\`/pinglist delete <name>\` - Upon successful confirmation, unsubscribes all pinglist members and deletes the pinglist from Sausage
`,

	'roll':
`\`/roll [talent] [modifier] [description] [dice]\`
- \`talent\` may be any one of [normal, talented, legendary, inept, godawful]
- \`modifier\` may be any integer, positive or negative
- \`description\` can be any text you want to describe the roll
- \`dice\` supports custom dice added by the Lime Metagamer move \`ALL THE DICE\`.

\`/roll [raw]\` 
- Parses dice like Avrae

All options for this command are optional. If no options are specified, Sausage will roll a flat \`2d8\` with no description.`,

	'starter':
`\`/starter (add|edit|remove|intro|post|outro) <name>\`

\`/starter add <name>\` - Adds intro, post, and outro trollcial templates for you to fill out for your troll
\`/starter edit <name>\` - Lets you edit your intro, post, and outro templates.
\`/starter remove <name>\` - Upon successful confirmation, deletes your troll's trollcial templates from Sausage
\`/starter intro <name>\` - Receive an ephemeral message with your troll's trollcial intro to copy/paste
\`/starter post <name>\` - Receive an ephemeral message with your troll's trollcial post template to copy/paste
\`/starter outro <name>\` - Receive an ephemeral message with your troll's trollcial outro to copy/paste`,

	'choose':
`\`/choose <choices>\`
- \`choices\` can be a list separated by \`;/, \` characters. 
Any of these can be present in a list; however, \`;\` will be prioritized over \`/\`, \`/\` will be prioritized over \`,\`, and \`,\` will be prioritized over spaces.

Ex.
> \`/choose Strawberry Chocolate Vanilla\`
> \`/choose Strawberry, Chocolate, Vanilla Swirl\`
> \`/choose Strawberry/Chocolate/Vanilla, Caramel Blast\`
> \`/choose Strawberry; Chocolate, or a similar flavor; Vanilla/Vanilla equivalent\``,

	'help':
`Command syntax:
- \`<option>\` - This option is **required**.
- \`[option]\` - This option are *optional*.
- \`(choice1|choice2|choice3)\` - You **must** pick a choice from this list.
- \`[choice1|choice2|choice3]\` - You *may* pick a choice from this list, or leave it blank.
- \`text\` - Type this text verbatim.`,
};

module.exports = {
	CHAR_LIMIT: 4000,
	versionNum: 'v3.1.2',
	lastUpdated: new Date('February 27, 2023 14:52 PST'),
	colorDict: colorDict,
	docDict: docDict,
	fanmadeLinks: fanmadeLinks,
	tableNames: tableNames,
	lookupTableNames: lookupTableNames,
	starterTypes: ['intro', 'post', 'outro'],
	birthdays: birthdays,
	helpText: helpText,
};