# statechannel
creating a state channel between to user for doing transactions 2 layer and then adding the net transaction to the blockchain and updating users balances after verifying their that both users signed it by a solidity smart contract.

* deploy the contract using truffle migrate command
* start your genache blockchain
* npm install
* open run.js file put your blockchain url (recommend using genache) at
// set your blockchain url here (this is usually the default for genache if you are using it)
const web3 =new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

* Add your 2 users private keys (by default the code uses the accounts of user 0 and user 1 in the blockchain so make sure to put the private keys of your user 0 and user 1 or you may change the accounts from here 
* // Assign your accounts here or you can leave it is with your first & second accounts on your blockchain being assigned
userA= accounts[0];
userB= accounts[1];
* set the priavte keys of both users here for signature:
* //Enter your userA  private key for signature
const a = await web3.eth.accounts.sign(message,"e5b8e89003c2b04157604837fe1af36081557054bdd2215c389846c3c0d27cdd")
* //Enter your userB private key for signature
const b = await web3.eth.accounts.sign(message,"cdc662c5773b410a7cdedbc50194b919bd5ab91bc9a58823053edc759fe85c61")

* make sure that you put private key of the sender here. for example if userA sends userB 5 ethr then userB sends A 2 ethr off chain, then to post to the blockchain A is the net transaction sender (3 ethr to be) when adding the trasaction to the blockchain you should add the sender(A in this case) private key here
// Enter the sender's private key in the buffer function
const pk=await new Buffer.from('e5b8e89003c2b04157604837fe1af36081557054bdd2215c389846c3c0d27cdd','hex')

* in the run method add all the trasactions you want to make off chain by calling this method for everyoffchain transaction
await offChainTransactions(sender address,receiver address,amount in eher)

* for execution use node run.js then you will get the desired output.
