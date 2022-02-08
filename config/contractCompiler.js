// compile code will go here
const {compileContract} = require("./compiler");

const compileLottery = () => {
    const contract = compileContract('Lottery.sol');
    return contract.Lottery;
}

module.exports = {
    compileLottery
}

