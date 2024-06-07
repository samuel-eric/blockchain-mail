import NodeRSA from 'node-rsa';
import { emailBlockchain, Block } from '@/utils/blockchain';

export async function GET(request, context) {
	const username = context.params.username;
	// baca blockchain
	emailBlockchain.readFromJson();
	const approvedSenders = emailBlockchain.chain
		.filter((block) => {
			return block.data?.for === username;
		})
		.sort((a, b) => b.timestamp - a.timestamp)
		.map((block) => block?.data);
	if (approvedSenders.length !== 0) {
		// verifikasi tanda tangan digital
		const res = await fetch(`${process.env.URL}/api/user/${username}`);
		const data = await res.json();
		const pubKey = data.user.publicKey;
		const validApprovedSender = approvedSenders
			.map((sender) => {
				const key = new NodeRSA();
				key.importKey(pubKey, 'pkcs8-public');
				const senderData = {
					for: sender.for,
					approvedSenders: sender.approvedSenders,
				};
				senderData.isValid = key.verify(
					JSON.stringify(senderData),
					sender.signature,
					'utf8',
					'base64'
				);
				return senderData;
			})
			.filter((sender) => sender.isValid)[0];
		return Response.json({
			approvedSenders: validApprovedSender.approvedSenders,
		});
	} else {
		return Response.json({ approvedSenders: [] });
	}
}
