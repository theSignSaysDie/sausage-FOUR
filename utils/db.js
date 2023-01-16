const mysql = require('mysql');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.TROLL_CALL_DOC_ID);

const trollFullNameDict = {};
const trollFirstNameDict = {};

const con = mysql.createPool({
	connectionLimit: 8,
	host: process.env.SQL_HOST,
	database: process.env.SQL_DB,
	user: process.env.SQL_USER,
	password: process.env.SQL_PW,
});

const fetchSQL = (query) => {
	return new Promise((resolve, reject) => {
		con.query(query, (err, elements) => {
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
	const sheet = doc.sheetsByIndex[0];
	await sheet.loadCells();
	for (const troll in trollFullNameDict) if (Object.prototype.hasOwnProperty.call(trollFullNameDict, troll)) delete trollFullNameDict[troll];
	for (const troll2 in trollFirstNameDict) if (Object.prototype.hasOwnProperty.call(trollFirstNameDict, troll2)) delete trollFirstNameDict[troll2];
	for (let col = 0; col < sheet.columnCount; col++) {
		for (let row = 1; row < sheet.rowCount; row++) {
			const cell = sheet.getCell(row, col);
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
	const end = new Date();
	const time = (end - start) / 1000;
	console.log(`Troll Call updated @ ${new Date().toLocaleString()}! (${time}s)`);
	return [trollFirstNameDict, trollFullNameDict];
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
};