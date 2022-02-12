const {compileContract} = require("zicky");

const compileLottery = () => {
    return compileContract('Lottery.sol', "contracts")
}

module.exports = {
    compileLottery
}

