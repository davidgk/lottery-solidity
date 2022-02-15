const path = require('path');
const reqPath = path.join(__dirname,'../../');
const envPath = path.join(reqPath,'.env');
require('dotenv').config({ path: envPath })
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const {compileLottery} = require("../contractCompiler");
/**
 *
 * @param apiInfura
 * @param contractCompiled
 * @returns {Promise<void>}
 */
const deploy = async (apiInfura = process.env.INFURA_RINKEBY_ENDPOINT_V3, contractCompiled) => {
    /**
     * Purpose:
     * Connect to to an specific EN
     * Unlock your account to make transactions against EN.
     * @type {HDWalletProvider}
     */
    console.log("ABI: " + JSON.stringify(contractCompiled.abi))
    const provider = new HDWalletProvider( process.env.ACCOUNT_MNEMONIC, apiInfura );
    const web3 = new Web3(provider)
    const accounts = await web3.eth.getAccounts();
    console.log ('Attempting to deploy from account', accounts[0]);
    if (contractCompiled){
        const data = contractCompiled.evm.bytecode.object;
        const deployedContract = await new web3.eth.Contract(contractCompiled.abi)
            .deploy({  data  })
            .send({ gas: 1000000 , from: accounts[0] });

        console.log('Contract deployed to', deployedContract.options.address)

    }
    await provider.engine.stop();
}


const deployLotteryRinkeby = async () => {
    await deploy(process.env.INFURA_RINKEBY_ENDPOINT_V3, compileLottery());
}

deployLotteryRinkeby();

module.exports = {
    deployLotteryRinkeby
}