import NodeRSA from 'node-rsa';
import { emailBlockchain, Block } from '@/utils/blockchain';

export async function GET(request, context) {
	const username = context.params.username;
	// baca blockchain
	emailBlockchain.readFromJson();
	const encryptedApprovedSenders = emailBlockchain.chain
		.filter((block) => {
			return block.data?.for === username;
		})
		.sort((a, b) => b.timestamp - a.timestamp)[0]?.data;
	if (encryptedApprovedSenders !== undefined) {
		// dekripsi email pakai kunci privat penerima
		const res = await fetch(`${process.env.URL}/api/user/${username}`);
		const data = await res.json();
		const privKey = data.user.privateKey;
		const key = new NodeRSA();
		key.importKey(privKey, 'pkcs8-private');
		const decryptedApprovedSenders = JSON.parse(
			key.decrypt(encryptedApprovedSenders.approvedSenders, 'utf8')
		);
		return Response.json({ approvedSenders: decryptedApprovedSenders });
	} else {
		return Response.json({ approvedSenders: [] });
	}
}
