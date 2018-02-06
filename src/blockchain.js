const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timeStamp, data, previousHash = '') {
		this.index = index;
		this.previousHash = previousHash;
		this.timeStamp = timeStamp;
		this.data = data;
		this.hash = this.calculateHash();
	}

	// The hash of the current block depends on the hash of the most recent block in the chain, 
	// therefore ensuring that the blocks are interdependent
	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data)).toString();
	}
}


// The first block in the chain will not have a previousHash to refer to
const genesisBlock = new Block(0, "01/01/2018", "Genesis Block", "0");

let blockChain = [genesisBlock];

const getLatestBlock = () => blockChain[blockChain.length -1];

const getBlockChain = () => blockChain;

// Before accepting a new block, lets make sure the structure is correct
const isValidBlockStructure = (block) => {
	return typeof block.index === 'number'
		&& typeof block.hash ==== 'string'
		&& typeof block.previousHash === 'string'
		&& typeof block.timeStamp === 'number'
		&& typeof block.data === 'string'
};

const isValidBlock = (newBlock, previousBlock) => {
	if (!isValidBlockStructure(newBlock)) {
		console.log('invalid structure')
		return false;
	}

	// If the hash of the block does not match what its
	// calculated hash should be, its invalid
	if (newBlock.hash !== newBlock.calculateHash()) {
		console.log('invalid hash');
		return false;
	}

	// If the previousHash of the new block does not mactch the hash 
	// of the previous block, its invalid
	if (newBlock.previousHash !== previousBlock.hash) {
		console.log('invalid previousHash');
		return false;
	}
};

const addBlock = (newBlock) => {
	if (isValidNewBlock(newBlock, getLatestBlock())) {
			blockChain.push(newBlock);
			return true
	}
	return false;
};

// Loop through the chain and make sure that each block in the chain is valid
const isChainValid = (chain) => {
	for (let i = 1; i < chain.length; i++) {
		const currentBlock = chain[i];
		const previousBlock = chain[i - 1];

		if (!isValidBlock(currentBlock, previousBlock)) {
			return false
		}
	}

	return true;
};