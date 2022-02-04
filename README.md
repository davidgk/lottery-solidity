# Lottery Solidity project
N players insert money , one manager decides when it ends. so we close, randomly we choose the winner player.



## About development
If you're using intellij as IDE, you should install solidity plugin. Also exists plugins for VSCode.

## About test
We should compile before running any test  on internal network


## Some modules
* Ganache/TestRPC => to create our local blockchain where we could deploy  the bytecode from compiled .sol
* Web3: another result from our compiled .sol is the ABI.. which allows through web3 with the code deployed into the block chain
 
## Deployment process on Ethereum networks
* Please **READ FIRST** all documentation bellow.
* You can run the deploying contract script using node in your local.
* Once your contract can be deployed you can check it ( using the address that was logged after run the script)
into [https://rinkeby.etherscan.io](), there you can see your contract deployed. 
* You can take a look on [https://remix.ethereum.org]() using web3 as network and connect you test account to check your contract.

### Variables to be defined into your .env:
**NOT USE A REAL ACCOUNT WITH REAL ETH  => if you don't want to expend real money**
* Account: ACCOUNT_MNEMONIC, 
* Infura: INFURA_RINKEBY_ENDPOINT_V3, INFURA_RINKEBY_ENDPOINT_WS, INFURA_PROJECT_ID, INFURA_PROJECT_SECRET

### About Infura:
Allows us through API to access a node to deploy a contract; then there it will be replicated to the EN ( 
Rinkeby or whatever we use for testing purpose.) 
* You should create an account within Infura.io
* Create a project, **BE SURE** to choose a test nw if you don't want to expend real ETh

### About provider
* As we should have a test account to create contracts
And we should add it our 12 words, add .env ( install dotenv )
file with a variable ACCOUNT_MNEMONIC, then there load your 12 words
* We install also ``npm i @truffle/hdwallet-provider`` as we'll need 
to create a provider. 
* This is not needed when we run the tests) 
* This is needed to connect to the EN and provide the account and Eth to the transaction needed to deploy our contracts)
