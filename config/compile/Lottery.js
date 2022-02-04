// compile code will go here
const path = require('path');
const fs = require('fs');
const solCompiler = require('solc');

const reqPath = path.join(__dirname,'../../');
const inboxPath = path.resolve(reqPath, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Inbox.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};




module.exports = () => JSON.parse(solCompiler.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery;

