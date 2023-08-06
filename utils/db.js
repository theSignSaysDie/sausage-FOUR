const mysql = require('mysql');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.TROLL_CALL_DOC_ID);

const trollFullNameDict = {};
const trollFirstNameDict = {};
const trollTitleDict = {};
const cardTradeSessions = {};

const con = mysql.createPool({
	connectionLimit: 8,
	host: process.env.SQL_HOST,
	database: process.env.SQL_DB,
	user: process.env.SQL_USER,
	password: process.env.SQL_PW,
	multipleStatements: false,
});

const fetchSQL = (query, params = []) => {
	return new Promise((resolve, reject) => {
		con.query(query, params, (err, elements) => {
			if (err) {
				console.log(`Big fuckup while processing ${query}`, err);
				return reject(err);
			}
			console.log(`Query '${query}' successful`);
			return resolve(elements);
		});
	});
};

function sanitizeForQuery(string) {
	return string.replace(/'/g, '\\\'');
}

async function loadTrollCall() {
	const start = new Date();
	console.log('Loading Troll Call...');
	await doc.useServiceAccountAuth({
		client_email: process.env.EMAIL,
		private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
	});
	await doc.loadInfo();

	// Alterniabound trolls
	const alterniaSheet = doc.sheetsByIndex[0];
	await alterniaSheet.loadCells();
	for (const troll in trollFullNameDict) if (Object.prototype.hasOwnProperty.call(trollFullNameDict, troll)) delete trollFullNameDict[troll];
	for (const troll2 in trollFirstNameDict) if (Object.prototype.hasOwnProperty.call(trollFirstNameDict, troll2)) delete trollFirstNameDict[troll2];
	for (let col = 0; col < alterniaSheet.columnCount; col++) {
		for (let row = 1; row < alterniaSheet.rowCount; row++) {
			const cell = alterniaSheet.getCell(row, col);
			if (typeof cell.hyperlink !== 'undefined') {
				const cellName = cell.value.toString().toLowerCase();
				trollFullNameDict[cellName] = cell.hyperlink;
				if (cellName.includes('??????') && (cellName !== '?????? ??????')) {
					const name = cellName.replace('??????', '').trim();
					trollFirstNameDict[name] = cell.hyperlink;
				} else if (cellName.includes(' ')) {
					const array = cellName.split(' ');
					trollFirstNameDict[array[0]] = cell.hyperlink;
				}
			}
		}
	}

	// Spacebound trolls
	const spaceSheet = doc.sheetsByIndex[4];
	await spaceSheet.loadCells();
	for (const troll in trollTitleDict) if (Object.prototype.hasOwnProperty.call(trollTitleDict, troll)) delete trollTitleDict[troll];
	for (let col = 0; col < spaceSheet.columnCount; col++) {
		for (let row = 1; row < spaceSheet.rowCount; row++) {
			const cell = spaceSheet.getCell(row, col);
			if (typeof cell.hyperlink !== 'undefined') {
				const cellName = cell.value.toString().toLowerCase();
				const title = cellName.substring(4);
				trollTitleDict[title] = cell.hyperlink;
			}
		}
	}

	const end = new Date();
	const time = (end - start) / 1000;
	console.log(`Troll Call updated @ ${new Date().toLocaleString()}! (${time}s)`);
	return [trollFirstNameDict, trollFullNameDict, trollTitleDict];
}

function getDocLink(id) {
	return `https://docs.google.com/document/d/${id}`;
}

module.exports = {
	con: con,
	fetchSQL: fetchSQL,
	sanitizeForQuery: sanitizeForQuery,
	loadTrollCall: loadTrollCall,
	getDocLink: getDocLink,
	trollFullNameDict: trollFullNameDict,
	trollFirstNameDict: trollFirstNameDict,
	trollTitleDict: trollTitleDict,
	cardTradeSessions: cardTradeSessions,
};