const path = require('path');
const reqPath = path.join(__dirname,'../../');
const envPath = path.join(reqPath,'.env');
require('dotenv').config({ path: envPath })
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const bytecodeCompiler = require('../compile/Lottery')
/**
 *
 * @param apiInfura
 * @returns {Promise<void>}
 */
const deploy = async (apiInfura = process.env.INFURA_RINKEBY_ENDPOINT_V3) => {
    /**
     * Purpose:
     * Connect to to an specific EN
     * Unlock your account to make transactions against EN.
     * @type {HDWalletProvider}
     */
    const provider = new HDWalletProvider( process.env.ACCOUNT_MNEMONIC, apiInfura );
    const web3 = new Web3(provider)
    const accounts = await web3.eth.getAccounts();
    console.log ('Attempting to deploy from account', accounts[0]);
    const contractCompiled = bytecodeCompiler();
    if (contractCompiled){
        const data = contractCompiled.evm.bytecode.object;
        /**
         * const deployedContract = await new web3.eth.Contract(contractCompiled.abi)
            .deploy({ arguments: ['Hi there!'] , data  })
            .send({ gas: 1000000 , from: accounts[0] });

        console.log('Contract deployed to', deployedContract.options.address)
        **/
    }
    await provider.engine.stop();
}


const deployRinkeby = async () => {
    await deploy();
}

deployRinkeby();

module.exports = {
    deployRinkeby
}