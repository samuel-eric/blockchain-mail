import fs from 'fs';
import aesjs from 'aes-js';

// random generated
const key = [
	85, 74, 19, 10, 28, 51, 25, 35, 88, 44, 34, 27, 33, 95, 59, 20, 93, 50, 39,
	94, 60, 30, 55, 2, 68, 62, 41, 14, 70, 22, 56, 76,
];

export async function GET(request, context) {
	const username = context.params.username;
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
	const selectedUser = decryptedUsers.find(
		(user) => user.username === username
	);
	return Response.json({ user: selectedUser });
}
