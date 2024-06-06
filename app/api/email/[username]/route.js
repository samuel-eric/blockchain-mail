import NodeRSA from 'node-rsa';
import { emailBlockchain, Block } from '@/utils/blockchain';

export async function GET(request, context) {
	const username = context.params.username;
	// baca blockchain
	emailBlockchain.readFromJson();
	const encryptedReceivedEmails = emailBlockchain.chain
		.filter((email) => {
			return email.data?.receiver === username;
		})
		.map((email) => ({ ...email.data, timestamp: email.timestamp }));
	console.log(encryptedReceivedEmails);
	if (encryptedReceivedEmails.length > 0) {
		// dekripsi email pakai kunci privat penerima
		const res = await fetch(`${process.env.URL}/api/user/${username}`);
		const data = await res.json();
		const receiverPrivKey = data.user.privateKey;
		const rsaReceiverKey = new NodeRSA();
		rsaReceiverKey.importKey(receiverPrivKey, 'pkcs8-private');
		const decryptedReceivedEmails = encryptedReceivedEmails.map((email) => {
			return {
				sender: email.sender,
				receiver: email.receiver,
				timestamp: email.timestamp,
				subject: rsaReceiverKey.decrypt(email.subject, 'utf8'),
				body: rsaReceiverKey.decrypt(email.body, 'utf8'),
				signature: rsaReceiverKey.decrypt(email.signature, 'utf8'),
			};
		});
		// verifikasi tanda tangan email
		const receivedEmails = await Promise.all(
			decryptedReceivedEmails.map(async (email) => {
				const res = await fetch(`${process.env.URL}/api/user/${email.sender}`);
				const data = await res.json();
				const senderPubKey = data.user.publicKey;
				const rsaSenderKey = new NodeRSA();
				rsaSenderKey.importKey(senderPubKey, 'pkcs8-public');
				const emailBody = {
					sender: email.sender,
					receiver: email.receiver,
					subject: email.subject,
					body: email.body,
				};
				const isValid = rsaSenderKey.verify(
					JSON.stringify(emailBody),
					email.signature,
					'utf8',
					'base64'
				);
				return { ...email, isValid };
			})
		);
		return Response.json({ emails: receivedEmails });
	} else {
		return Response.json({ emails: [] });
	}
}
