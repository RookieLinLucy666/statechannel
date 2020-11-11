
pragma solidity ^0.4.18;

contract stateChannel {
    event LogMoneySent(address to, uint amount);
     
   uint public count;

   
    function() public payable{}
       
    function sendMoney(address to, uint amount,
        bytes32 rA, bytes32 sA, uint8 vA,
        address userA,
        address userB,
        bytes32 rB, bytes32 sB, uint8 vB)
        public payable 
    {
        bytes32 message = keccak256(this, to, amount, count);
        require(recover(message, rA, sA, vA) == userA);
        require(recover(message, rB, sB, vB) == userB);
        
        to.send(msg.value);
        count++;
        LogMoneySent(to, amount);
    }

   
    
    function recover(bytes32 message, bytes32 r, bytes32 s, uint8 v)
        public pure returns (address)
    {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, message);
        return ecrecover(prefixedHash, v, r, s);
    }

    function hashPermissionMessage(address to, uint amount)
        public view returns (bytes32)
    {
        return keccak256(this, to, amount, count);
    }
}