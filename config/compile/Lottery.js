// compile code will go here
const path = require('path');
const fs = require('fs');
const solCompiler = require('solc');

const reqPath = path.join(__dirname,'../../');
const lotteryPath = path.resolve(reqPath, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol': {
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




module.exports = () => {
    let compiled = JSON.parse(solCompiler.compile(JSON.stringify(input)))
    const contract = compiled.contracts["Lottery.sol"];
    return contract.Lottery;
}

