

const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
    toBech32Address,
    getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');

const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

const test = async () => {
    const txdata = { "version": 65537, "nonce": 1, "toAddr": "0x0000000000000000000000000000000000000000", "amount": "0", "gasPrice": "10000000", "gasLimit": "9000", "code": "", "data": "[{\"vname\":\"_scilla_version\",\"type\":\"Uint32\",\"value\":\"0\"},{\"vname\":\"initial_owners\",\"type\":\"List ByStr20\",\"value\":{\"constructor\":\"Cons\",\"argtypes\":[\"ByStr20\"],\"arguments\":[\"0x1234567890123456789012345678906784567890\",{\"constructor\":\"Cons\",\"argtypes\":[\"ByStr20\"],\"arguments\":[\"0xabcdeabcde123456786782345678901234567890\",{\"constructor\":\"Cons\",\"argtypes\":[\"ByStr20\"],\"arguments\":[\"0xffcdeabcde126786789012345678901234567890\",{\"constructor\":\"Nil\",\"argtypes\":[\"ByStr20\"],\"arguments\":[]}]}]}]}},{\"vname\":\"required_signatures\",\"type\":\"Uint32\",\"value\":\"2\"}]", "signature": "5bb4c929d7ce95b05d2c3539a39b32d63e90457e58375d1244830c5b05b0038364a27361c8baa2e22bc42287fd088f7ee9570cdae5b1d654437d7b27f3f2ed7b" };

    const tx = zilliqa.transactions.new(txdata);

    // Send a transaction to the network
    tx = await zilliqa.blockchain.createTransaction(tx);
    console.log(tx.id);
}

test();

curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "CreateTransaction",
    "params": [{
      "version": 65537,
      "nonce": 1,
      "toAddr": "0x4BAF5faDA8e5Db92C3d3242618c5B47133AE003C",
      "amount": "1000000000000",
      "pubKey": "0205273e54f262f8717a687250591dcfb5755b8ce4e3bd340c7abefd0de1276574",
      "gasPrice": "1000000000",
      "gasLimit": "1",
      "code": "",
      "data": "",
      "signature": "29ad673848dcd7f5168f205f7a9fcd1e8109408e6c4d7d03e4e869317b9067e636b216a32314dd37176c35d51f9d4c24e0e519ba80e66206457c83c9029a490d",
      "priority": false
    }]
}' -H "Content-Type: application/json" -X POST "https://api.zilliqa.com/"