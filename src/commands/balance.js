const {Command, flags} = require('@oclif/command');

const inquirer = require('inquirer');

const {Zilliqa} = require('@zilliqa-js/zilliqa');
const CP = require('@zilliqa-js/crypto');
const {BN, units} = require('@zilliqa-js/util');

class BalanceCommand extends Command {
  async getAddressFromPrivateKey(params) {
    // Remove 0x from privateKey if it's present
    let privateKey = params.privateKey.replace('0x', '');

    // get Address from privateKey
    return CP.getAddressFromPrivateKey(privateKey);
  }

  async getBalanceByAddress(params) {
    // Sanitize Address input
    let address = params.address.replace('0x', '');

    // Get Account balance
    const balance = await this.zilliqa.blockchain.getBalance(address);

    if (balance.error !== undefined) {
      this.error(balance.error.message);
    }

    // Convert balance
    let convertedBalance = units.fromQa(new BN(balance.result.balance), units.Units.Zil);

    return convertedBalance;

    // ADDRESS checl /^0x[a-fA-F0-9]{40}$/
  }

  async run() {
    const {flags, args} = this.parse(BalanceCommand);

    let hash = args.hash;
    const testnet = flags.testnet;
    const checkType = flags.by;

    const apiAddress = testnet === true ? 'https://dev-api.zilliqa.com' : 'https://api.zilliqa.com';

    this.zilliqa = new Zilliqa(apiAddress);

    if (hash === null) {
      hash = (await inquirer.prompt([
        {
          name: 'value',
          message: `Please enter your ${checkType}`,
          type: 'input',
        },
      ])).value;
    }

    switch (checkType) {
    case 'privateKey':
      {
        const address = await this.getAddressFromPrivateKey({privateKey: hash});
        const balance = await this.getBalanceByAddress({address});
        this.log(balance);
      }

      break;

    case 'address':
      {
        const balance = await this.getBalanceByAddress({address: hash});
        this.log(balance);
      }
      break;

    default:
      {
        const balance = await this.getBalanceByAddress({address: hash});
        this.log(balance);
      }
      break;
    }
  }
}

BalanceCommand.description = `Check balance by address or by Private Key
NOTE: --by flag is required. See examples below
`;

BalanceCommand.args = [
  {
    name: 'hash',
    description: 'Address or Private Key value',
    default: null,
  },
];

BalanceCommand.flags = {
  by: flags.string({
    char: 'b',
    description: 'Type of check: privateKey or address',
    options: ['privateKey', 'address'],
    default: 'address',
  }),
  testnet: flags.boolean({char: 't', description: 'Use testnet', default: false}),
  convert: flags.string({char: 'c', description: 'Convert to', default: 'zil'}),
};

BalanceCommand.examples = [
  '$ zilcli balance 23sdg235935dsg9325sd',
  '$ zilcli balance 23sdg235935dsg9325sd --by=privateKey',
  '$ zilcli balance 23sdg235935dsg9325sd --by=address --testnet',
];

module.exports = BalanceCommand;
