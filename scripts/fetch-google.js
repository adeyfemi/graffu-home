// @ts-nocheck
import fs from "fs";
import archieml from "archieml";
import docs from "../google.config.js";

const CWD = process.cwd();

const fetchGoogle = async ({ id, gid }) => {
	console.log(`fetching...${id}`);

	const base = "https://docs.google.com";
	const post = gid
		? `spreadsheets/u/1/d/${id}/export?format=csv&id=${id}&gid=${gid}`
		: `document/d/${id}/export?format=txt`;
	const url = `${base}/${post}`;

	try {
		const response = await fetch(url);
		const text = await response.text();

		if (gid) {
			const lines = text.split(/\r?\n/);
			const headers = lines[0].split(',');
			const result = [];

			for (let i = 1; i < lines.length; i++) {
				const obj = {};
				const currentLine = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(s => s.replace(/^"(.*)"$/, '$1'));


				for (let j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentLine[j];
				}
				
				if (obj['show'] == '1') { result.push(obj) };
			}
			return JSON.stringify(result);
		}

		const parsed = archieml.load(text);
		const str = JSON.stringify(parsed);
		return str;
	} catch (err) {
		throw new Error(err);
	}
};

(async () => {
	for (let d of docs) {
		try {
			const str = await fetchGoogle(d);
			const file = `${CWD}/${d.filepath}`;
			fs.writeFileSync(file, str);
		} catch (err) {
			console.log(err);
		}
	}
})();
