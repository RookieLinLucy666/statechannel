const eutil = require('ethereumjs-util')
const Web3=require('web3')
const BigNumber=require('bignumber.js')
// set your blockchain url here (this is usually the default for genache if you are using it)
const web3 =new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
const Tx=require('ethereumjs-tx').Transaction
const json=require('./build/contracts/stateChannel.json')
const abi=json.abi
let contractAddress;
web3.eth.net.getId(function(err,res){
contractAddress= json.networks[res].address
})
var userA; 
var userB;
var onChainBalanceUserA;
var onChainBalanceUserB; 
var offChainBalanceUserA;
var offChainBalanceUserB;
var amount;
var recipient;
var sender;

//function just sets our environment to start
async function init (){
var accounts =await web3.eth.getAccounts()

// Assign your accounts here or you can leave it is with your first & second accounts on your blockchain being assigned
userA= accounts[0];
userB= accounts[1];

onChainBalanceUserA=await web3.eth.getBalance(userA)
offChainBalanceUserA=await web3.eth.getBalance(userA)

onChainBalanceUserB=await web3.eth.getBalance(userB)
offChainBalanceUserB=await web3.eth.getBalance(userB)

}


// function for doing an off chain transaction
 async function offChainTransactions(addressFrom, addressTo, value){
  if(addressFrom==userA)
    {

     if(offChainBalanceUserA-Web3.utils.toWei(value.toString(), 'ether')>=0){
   offChainBalanceUserA=  offChainBalanceUserA-Web3.utils.toWei(value.toString(), 'ether')
    offChainBalanceUserB= new BigNumber(offChainBalanceUserB).plus(Web3.utils.toWei(value.toString(), 'ether'))
   }

   }
  else{
    if(offChainBalanceUserB-Web3.utils.toWei(value.toString(), 'ether')>=0){
    offChainBalanceUserB= offChainBalanceUserB- Web3.utils.toWei(value.toString(), 'ether')
    offChainBalanceUserA= new BigNumber(offChainBalanceUserA).plus(Web3.utils.toWei(value.toString(), 'ether'))
}
  }


}
 //function to calculate the net of all our transactions to send it to the blockchain
 async function netTransaction(callback){
 
    if(offChainBalanceUserA<=onChainBalanceUserA){
    amount=await Web3.utils.fromWei((onChainBalanceUserA-offChainBalanceUserA).toString(), 'ether')
    
        recipient= userB
        sender= userA
      }
      else{
      amount=await Web3.utils.fromWei((onChainBalanceUserB-offChainBalanceUserB).toString(), 'ether')
      
         recipient= userA
         sender= userB

       }

      callback()
 }

async function finalize(){

await web3.eth.getTransactionCount(sender,async (err,txCount)=>{
//creating instance of the contract
const contract= await new web3.eth.Contract(abi,contractAddress)
contract.handleRevert
const message =  await contract.methods.hashPermissionMessage(recipient, Web3.utils.toWei(amount.toString(), 'ether')).call()
//Enter your userA  private key for signature
const a = await web3.eth.accounts.sign(message,"e5b8e89003c2b04157604837fe1af36081557054bdd2215c389846c3c0d27cdd")
//Enter your userB private key for signature
const b = await web3.eth.accounts.sign(message,"cdc662c5773b410a7cdedbc50194b919bd5ab91bc9a58823053edc759fe85c61")
// Enter the sender's private key in the buffer function
const pk=await new Buffer.from('e5b8e89003c2b04157604837fe1af36081557054bdd2215c389846c3c0d27cdd','hex')

//creating transaction object
const txObject= await{
to: contractAddress, 
    value: web3.utils.toHex(Web3.utils.toWei(amount.toString(), "ether")),
    nonce: web3.utils.toHex(txCount),
    gasLimit:web3.utils.toHex(800000),
    gasPrice:web3.utils.toHex(web3.utils.toWei('1', "gwei")),
   data:await contract.methods.sendMoney(recipient,Web3.utils.toWei(amount.toString(), 'ether'),eutil.bufferToHex(a.r),eutil.bufferToHex(a.s),a.v,userA,userB,eutil.bufferToHex(b.r),eutil.bufferToHex(b.s),b.v).encodeABI()

}
const tx= await new Tx(txObject)
tx.sign(pk)
const serializedTx=tx.serialize()
const raw ='0x'+serializedTx.toString('hex')
// sending transaction to smart contract to approve the offchain transaction and update balances accordingly after verifying the signatures of both parties
web3.eth.sendSignedTransaction(raw,(err,txtHash)=>{
  if(err)
  console.log(err)
  else
  console.log('Transcation approved with hash: ',txtHash)
})
})
}

 async function run (){
  // a method for intializing the contract and the accounts
  await init()
  // user A sends user B 0.09 ethr
  await offChainTransactions(userA,userB,0.09)
  // user B sends user A 0.01 ethr 
  await offChainTransactions(userB,userA,0.01)
  // calculating the net of the trasactions(A sends B 0.08 ethr) signing it by both users sending it to the contract to verify the signature and updating their balances
    await netTransaction(finalize)
 
 }

 run()
 