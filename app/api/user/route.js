import fs from 'fs';
import NodeRSA from 'node-rsa';
import aesjs from 'aes-js';

const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export async function POST(request) {
	const body = await request.json();
	// generate public and private key
	const rsaKey = new NodeRSA({ b: 512 });
	const privateKey = rsaKey.exportKey('pkcs8-private');
	const publicKey = rsaKey.exportKey('pkcs8-public');
	// encrypt using aes
	const aesCtr = new aesjs.ModeOfOperation.ctr(key);
	const encryptedData = {
		username: aesjs.utils.hex.fromBytes(
			aesCtr.encrypt(aesjs.utils.utf8.toBytes(body.username))
		),
		password: aesjs.utils.hex.fromBytes(
			aesCtr.encrypt(aesjs.utils.utf8.toBytes(body.password))
		),
		walletAddress: aesjs.utils.hex.fromBytes(
			aesCtr.encrypt(aesjs.utils.utf8.toBytes(body.walletAddress))
		),
		publicKey: aesjs.utils.hex.fromBytes(
			aesCtr.encrypt(aesjs.utils.utf8.toBytes(publicKey))
		),
		privateKey: aesjs.utils.hex.fromBytes(
			aesCtr.encrypt(aesjs.utils.utf8.toBytes(privateKey))
		),
	};
	// add to json file
	fs.readFile('data/db.json', 'utf8', (err, data) => {
		if (err) {
			console.log(err);
		} else {
			if (data.length !== 0) {
				const arr = JSON.parse(data);
				arr.push(encryptedData);
				const json = JSON.stringify(arr);
				fs.writeFileSync('data/db.json', json);
			} else {
				const json = JSON.stringify([encryptedData]);
				fs.writeFileSync('data/db.json', json);
			}
		}
	});
	return Response.json({
		message: 'User sign up successfully',
		user: { ...body, privateKey, publicKey },
	});
}

export async function GET(request) {
	const encryptedUsers = JSON.parse(
		fs.readFileSync('data/db.json', { encoding: 'utf8' })
	);
	const decryptedUsers = [];
	encryptedUsers.forEach((encryptedUser) => {
		const aesCtr = new aesjs.ModeOfOperation.ctr(key);
		const decryptedUser = {
			username: aesjs.utils.utf8.fromBytes(
				aesCtr.decrypt(aesjs.utils.hex.toBytes(encryptedUser.username))
			),
			password: aesjs.utils.utf8.fromBytes(
				aesCtr.decrypt(aesjs.utils.hex.toBytes(encryptedUser.password))
			),
			walletAddress: aesjs.utils.utf8.fromBytes(
				aesCtr.decrypt(aesjs.utils.hex.toBytes(encryptedUser.walletAddress))
			),
			publicKey: aesjs.utils.utf8.fromBytes(
				aesCtr.decrypt(aesjs.utils.hex.toBytes(encryptedUser.publicKey))
			),
			privateKey: aesjs.utils.utf8.fromBytes(
				aesCtr.decrypt(aesjs.utils.hex.toBytes(encryptedUser.privateKey))
			),
		};
		decryptedUsers.push(decryptedUser);
	});

	return Response.json({ users: decryptedUsers });
}
