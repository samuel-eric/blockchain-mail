import { sha256 } from 'js-sha256';
import fs from 'fs';

class Block {
	constructor(data = {}) {
		this.timestamp = Date.now().toString();
		this.data = data;
		this.hash = this.getHash();
		this.prevHash = '';
	}

	getHash() {
		return sha256(this.timestamp + JSON.stringify(this.data) + this.prevHash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [new Block()];
	}

	getLastBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(block) {
		block.prevHash = this.getLastBlock().hash;
		block.hash = block.getHash();

		this.chain.push(block);
	}

	isValid(blockchain = this) {
		for (let i = 1; i < blockchain.chain.length; i++) {
			const currentBlock = blockchain.chain[i];
			const prevBlock = blockchain.chain[i - 1];

			if (
				currentBlock.hash !== currentBlock.getHash() ||
				prevBlock.hash !== currentBlock.prevHash
			) {
				return false;
			}
		}
		return true;
	}

	saveToJson() {
		console.log(this.chain);
		const json = JSON.stringify(this.chain);
		fs.writeFileSync('data/blockchain.json', json);
	}

	readFromJson() {
		const data = fs.readFileSync('data/blockchain.json', 'utf8');
		const blockchain = JSON.parse(data);
		if (blockchain.length === 0) {
			this.chain = [new Block()];
		} else {
			this.chain = blockchain;
		}
	}
}

const emailBlockchain = new Blockchain();

export { emailBlockchain, Block };
