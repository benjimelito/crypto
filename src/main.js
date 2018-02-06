const bodyParser = require('body-parser');
const express = require ('express');
const blockChain = require('./blockchain');

const port = process.env.HTTP_PORT || 3001;

const initHttpServer = (port) => {
	const app = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.get('/blocks', (req, res) => {
		res.send(blockChain.getBlockChain())
	});

	app.post('/mineBlock', (req, res) => {
		const newBlock = blockChain.generateNewBlock(req.body.data);
		res.send(newBlock);
	});

	app.listen(port, () => {
		console.log('Listening on port: ' + port);
	});
};

initHttpServer(port);