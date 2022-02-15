// contract test code will go here
const chaiAsPromised = require('chai-as-promised');
const {expect} = require('chai');
// Ethereum test network
const ganache = require('ganache-cli');
// how to communicate our code with that.
const Web3 = require('web3')
const {compileContract, getAbiFromContract} = require("zicky");
const path = require("path");
const fs = require("fs");
// get the interface and definition from contract , once compiled



const localNetworkProvider = ganache.provider();
const web3 = new Web3(localNetworkProvider)

    /**
     *  web3 Main task up to now:
     *  1.- give the accounts unlock to tests our contracts
     *  2.- Deploy our contracts
     *  To deploy it only need the ABI and the bitecode
     *  3.- Communicate through JS apps to our contracts deployed on Network     *
     *  To interact with the contract we need:
     *  ABI ( the interface ! )  and the address of deployed contract!
    */



async function deployContract(contractDeployer, contractCompiled, arguments, account, value = 0) {
    return contractDeployer
        // create the transaction Object to be sent
        .deploy({data: contractCompiled.evm.bytecode.object, arguments})
        .send({from: account, gas: 1000000, value});
}

describe ('Lottery Contract tests', () => {
    let accounts, lottery, contractDeployer, contractCompiled,account;
    beforeEach(async () => {
        // Get a list of all accounts
        accounts = await web3.eth.getAccounts();
        // Use one of those accounts to deploy the contract
        contractCompiled = compileContract('Lottery.sol', "contracts")
        // Teaches to web3 about what methods and lottery has, remember
        // web3 has the bridge role between ou contract and EN
        // abi is the JS layer between deployed code and us
        // we should pass the interface, under JSON format, said nothing about specific contract
        contractDeployer = new web3.eth.Contract(contractCompiled.abi);
        account = accounts[0];
        lottery = await deployContract(contractDeployer, contractCompiled, [], account);
    })
    it( 'obtain accounts from web3', () => {
       expect(accounts.length > 0).to.be.true;
    })
    describe('when we deploy it  with an account ' , () => {
        it( 'it was successful', async () => {
            expect(lottery).not.to.be.null;
            // means that it was successfully deploy if address exists
            console.log(lottery.options.address)
            expect(lottery.options.address).not.to.be.null;
            expect(lottery.options.address.length).to.eq(42);
        })
        it( 'manager was corrected assigned', async () => {
            expect(await lottery.methods.manager().call()).to.eq(account);
        })
        describe('when we enter a player ' , () => {
            let player;
            const VALID_ETHER_VALUE_WEI = web3.utils.toWei("0.11");
            beforeEach(async() => {
                player = accounts[1];
            })
            it('with correct amount of money it should entered as player', async() => {
                await lottery.methods.enter().send({ from: player, value: VALID_ETHER_VALUE_WEI  });
                const playerSaved = await lottery.methods.players(0).call();
                expect(playerSaved).to.eq(player);
            })
            it('with incorrect amount of money it should throw error', async() => {
                try {
                    await lottery.methods.enter().send({from: player, value: 200})
                    expect.fail('Should fail!');
                } catch (e) {
                    expect(e.message).to.eq('VM Exception while processing transaction: revert');
                }
            })
        })
    })
    describe('pickWinner' , () => {
        const VALID_ETHER_VALUE_WEI = web3.utils.toWei("2","ether");
        const AMOUNT_WIN = VALID_ETHER_VALUE_WEI;
        beforeEach(async() => {
            // add 4 players
            await lottery.methods.enter().send({ from: accounts[1], value: VALID_ETHER_VALUE_WEI });
        });
        it('before pick a winner balance should be 4 ether', async() => {
            const balance =  await lottery.methods.balance().call();
            expect(balance).to.eq( String(AMOUNT_WIN) );
        });

        it('another way to check balance', async() => {
            const balance =  await web3.eth.getBalance(lottery.options.address)
            expect(balance).to.eq( String(VALID_ETHER_VALUE_WEI) );
        });

        it('before pick a winner players would be 1', async() => {
            const players =  await lottery.methods.getPlayers().call();
            expect(players.length).to.eq( 1);
            expect(players[0]).to.eq( accounts[1]);
        });
        it('when pick a winner from another than manager should throw error', async() => {
            try {
                await lottery.methods.pickWinner().send({from: accounts[5], gas: 1000000});
                expect.fail('Should fail!');
            } catch (e) {
                expect(e.message).to.eq( 'VM Exception while processing transaction: revert');
            }
        })
        it('pick a winner will get a which exist in the first four address of account list', async() => {
            const firstFourAddress = accounts.slice(0,5);
            await lottery.methods.pickWinner().send({from: account, gas: 1000000});
            const winner = await lottery.methods.winner().call();
            expect(firstFourAddress.includes(winner)).to.be.true;
            const balance =  await lottery.methods.balance().call();
            expect(balance).to.eq( "0" );
        })
        it('winner will increase its balance', async() => {
            const originalBalance = Number(await web3.eth.getBalance(accounts[1]));
            await lottery.methods.pickWinner().send({from: account, gas: 1000000});
            const winner = await lottery.methods.winner().call();
            expect(winner).to.eq( accounts[1] );
            const winnerBalance = Number(await web3.eth.getBalance(accounts[1]))
            expect(winnerBalance - originalBalance).to.eq( Number(AMOUNT_WIN) );
        })
        it('after pick a winner players would be 0', async() => {
            await lottery.methods.pickWinner().send({from: account, gas: 1000000});
            const players =  await lottery.methods.getPlayers().call();
            expect(players.length).to.eq( 0);
        });
        it('test getAbi', async() => {
            getAbiFromContract('Lottery.sol', "contracts");
            let expected = '../Lottery.abi.js';
            expect(fs.existsSync(path.join(__dirname, expected))).to.be.true
        });
    })
})