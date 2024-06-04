import fs from 'node:fs';

const key = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
	22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
];

export async function POST(request) {
	const body = await request.json();
	console.log(body);
	// generate public and private key
	// encrypt using aes
	fs.readFile('data/db.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			const arr = JSON.parse(data);
			arr.push(body);
			const json = JSON.stringify(arr);
			fs.writeFileSync('data/db.json', json);
		}
	});
	return Response.json({ test: 'test' });
}
