import NodeRSA from 'node-rsa';
import { emailBlockchain, Block } from '@/utils/blockchain';

export async function POST(request) {
	const body = await request.json();
	// enkripsi data pakai kunci publik user
	const key = new NodeRSA();
	key.importKey(body.pubKey, 'pkcs8-public');
	const encrytedData = {
		for: body.username,
		approvedSenders: key.encrypt(
			JSON.stringify(body.approvedSenders),
			'base64'
		),
	};
	// tambah ke blockchain
	emailBlockchain.readFromJson();
	emailBlockchain.addBlock(new Block(encrytedData));
	emailBlockchain.saveToJson();
	return Response.json({ message: 'Approved senders updated' });
}
