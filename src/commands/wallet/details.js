const ZilliqaBase = require('../../base').default;

const inquirer = require('inquirer');
const chalk = require('chalk');

const {Zilliqa} = require('@zilliqa-js/zilliqa');

const {getBalanceByAddress} = require('../../utils/blockchain');

class WalletDetailsCommand extends ZilliqaBase {
  async run() {
    const {args} = this.parse(WalletDetailsCommand);
    let name = args.name;
    let account;

    if (name === undefined) {
      const accounts = await super.getAccounts();
      account = (await inquirer.prompt([
        {
          name: 'value',
          message: 'Select account:',
          type: 'list',
          required: true,
          choices: accounts.map(item => {
            return {name: item.name, value: item};
          }),
        },
      ])).value;
    } else {
      account = await super.getAccount(name);
    }

    const passphrase = (await inquirer.prompt([
      {
        name: 'value',
        message: 'Enter passphrase',
        type: 'password',
        required: true,
        mask: true,
      },
    ])).value;

    let address;
    let accountDetails;

    const zilliqa = new Zilliqa(account.network.apiAddress);
    try {
      address = await zilliqa.wallet.addByKeystore(JSON.stringify(account.data), passphrase);

      accountDetails = await zilliqa.wallet.accounts[address];
    } catch (error) {
      this.error(chalk.red.bold('Could not decrypt keystore file.'));
    }

    const balance = await getBalanceByAddress(address, account.network.apiAddress);

    this.log(`Name ${chalk.yellow(account.name)}`);
    this.log(`ID: ${account.data.id}`);
    this.log(`Address: ${chalk.green.bold(address)}`);
    this.log(`Balance: ${chalk.bold(balance + ' ZIL')}`);
    this.log('---');
    this.log(accountDetails);
    this.log('---');
    this.log('Network details:');
    this.log(account.network);
  }
}

WalletDetailsCommand.description = `Prints out details about Wallet
Returned data: Name, ID, Address, Balance privateKey, publicKey, Network details
`;

WalletDetailsCommand.args = [
  {
    name: 'name',
    description: 'Wallet name to get details for',
  },
];

module.exports = WalletDetailsCommand;
