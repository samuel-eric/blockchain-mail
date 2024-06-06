import NodeRSA from 'node-rsa';
import { emailBlockchain, Block } from '@/utils/blockchain';

export async function POST(request) {
	const body = await request.json();
	// tanda tangan email
	const emailBody = {
		sender: body.sender,
		receiver: body.receiver,
		subject: body.subject,
		body: body.body,
	};
	const rsaSenderKey = new NodeRSA();
	rsaSenderKey.importKey(body.senderPrivKey, 'pkcs8-private');
	const signature = rsaSenderKey.sign(JSON.stringify(emailBody), 'base64');
	// enkripsi email pakai kunci publik penerima
	const rsaReceiverKey = new NodeRSA();
	rsaReceiverKey.importKey(body.receiverPubKey, 'pkcs8-public');
	const encrytedData = {
		sender: body.sender,
		receiver: body.receiver,
		subject: rsaReceiverKey.encrypt(body.subject, 'base64'),
		body: rsaReceiverKey.encrypt(body.body, 'base64'),
		signature: rsaReceiverKey.encrypt(signature, 'base64'),
	};
	// tambah ke blockchain
	emailBlockchain.readFromJson();
	emailBlockchain.addBlock(new Block(encrytedData));
	emailBlockchain.saveToJson();
	return Response.json({ message: 'Email sent' });
}
