import { sha256 } from 'js-sha256';

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
}
