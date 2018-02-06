const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, hash, previousHash, timeStamp, data) {
		this.index = index;
		this.previousHash = previousHash;
		this.timeStamp = timeStamp;
		this.data = data;
		this.hash = hash;
		this.nonce = 0;
	}
}


// The first block in the chain will not have a previousHash to refer to
const genesisBlock = new Block(0, '006534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', "0", 1517945563986, "Genesis Block");

// For now, not using a database
let blockChain = [genesisBlock];

// How many leading 0s do we want our hashes to begin with?
const difficulty = 2;

const getLatestBlock = () => blockChain[blockChain.length -1];

const getBlockChain = () => blockChain;

// The hash of the current block depends on the hash of the most recent block in the chain, 
// therefore ensuring that the blocks are interdependent
const calculateHash = (index, previousHash, timeStamp, data, nonce) => 
	SHA256(index + previousHash + timeStamp + JSON.stringify(data) + nonce).toString();

const calculateHashForBlock = (block) => calculateHash(block.index, block.previousHash, block.timeStamp, block.data, block.nonce);

const mineBlock = (difficulty, block) => {
	let startMine = Date.now();
	
	// Keep incrementing the 'nonce' value until we can randomly generate a hash value
	// that satisfies our difficulty parameters
	while(block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
		block.nonce ++;
		block.hash = calculateHashForBlock(block);
	}

	let endMine = Date.now();
	let miningTime = endMine - startMine;

	console.log('It took ' + miningTime + ' milliseconds to mine this block');
}

// Before accepting a new block, lets make sure the structure is correct
const isValidBlockStructure = (block) => {
	return typeof block.index === 'number'
		&& typeof block.hash === 'string'
		&& typeof block.previousHash === 'string'
		&& typeof block.timeStamp === 'number'
		&& typeof block.data === 'string'
};

const isValidBlock = (newBlock, previousBlock) => {
	if (!isValidBlockStructure(newBlock)) {
		console.log('invalid structure: ', newBlock)
		return false;
	}

	// If the hash of the block does not match what its
	// calculated hash should be, its invalid
	if (newBlock.hash !== calculateHashForBlock(newBlock)) {
		console.log('invalid hash');
		return false;
	}

	// If the previousHash of the new block does not match the hash 
	// of the previous block, its invalid
	if (newBlock.previousHash !== previousBlock.hash) {
		console.log('invalid previousHash');
		return false;
	}
};

// If the block is valid based on our checks defined above, add it
// to the chain
const addBlock = (newBlock) => {
	
	// Apply our mining algorithm to the block, it will already have a hash
	// but we need to apply our difficulty settings to it
	let minedHash = mineBlock(difficulty, newBlock);

	if (isValidBlock(newBlock, getLatestBlock())) {
			blockChain.push(newBlock);
			return true
	}
	return false;
};

// Create a new block
const generateNewBlock = (blockData) => {
	const previousBlock = getLatestBlock();
	const nextIndex = previousBlock.index +1;
	const nextTimeStamp = Date.now();
	const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData);
	const newBlock = new Block(nextIndex, nextHash, previousBlock.hash, nextTimeStamp, blockData);
	addBlock(newBlock);
	return newBlock;
}

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

module.exports = {
	getBlockChain,
	generateNewBlock
};