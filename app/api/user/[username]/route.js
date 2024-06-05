import fs from 'fs';
import aesjs from 'aes-js';

const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

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
