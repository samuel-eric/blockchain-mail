import NodeRSA from 'node-rsa';
import { emailBlockchain, Block } from '@/utils/blockchain';

export async function POST(request) {
	const body = await request.json();
	// tanda tangan pakaai kunci privat pengguna
	const key = new NodeRSA();
	key.importKey(body.privKey, 'pkcs8-private');
	const data = {
		for: body.username,
		approvedSenders: body.approvedSenders,
	};
	const signature = key.sign(JSON.stringify(data), 'base64');
	data.signature = signature;
	// tambah ke blockchain
	emailBlockchain.readFromJson();
	emailBlockchain.addBlock(new Block(data));
	emailBlockchain.saveToJson();
	return Response.json({ message: 'Approved senders updated' });
}
