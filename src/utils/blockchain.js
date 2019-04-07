const {Zilliqa} = require('@zilliqa-js/zilliqa');
const CP = require('@zilliqa-js/crypto');
const {BN, units} = require('@zilliqa-js/util');

const remove0x = string => {
  return string.replace('0x', '');
};

const add0x = string => {
  return '0x' + string;
};

const validateAddress = string => {
  string = remove0x(string);

  return /^[a-fA-F0-9]{40}$/.test(string);
};

const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const getAddressFromPrivateKey = async privateKey => {
  // Remove 0x from privateKey if it's present
  privateKey = remove0x(privateKey);

  // get Address from privateKey
  return CP.getAddressFromPrivateKey(privateKey);
};

const getBalanceByAddress = async (address, node) => {
  // Sanitize Address input
  address = remove0x(address);

  // Initialize Zilliqa blockchain
  const zilliqa = new Zilliqa(node);

  try {
    // Get Account balance
    const balance = await zilliqa.blockchain.getBalance(address);

    if (balance.result !== undefined) {
      // Convert balance to Zil
      let convertedBalance = units.fromQa(new BN(balance.result.balance), units.Units.Zil);

      return convertedBalance;
    }

    return 0;
  } catch (error) {
    return 0;
  }
};

module.exports = {
  add0x,
  remove0x,
  validateAddress,
  isNumeric,
  getAddressFromPrivateKey,
  getBalanceByAddress,
};
