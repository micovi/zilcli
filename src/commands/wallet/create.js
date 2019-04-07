const ZilliqaBase = require('../../base').default;

const inquirer = require('inquirer');
const slugify = require('slugify');

const {Zilliqa} = require('@zilliqa-js/zilliqa');

class WalletCreateCommand extends ZilliqaBase {
  async run() {
    const {args} = this.parse(WalletCreateCommand);
    const networks = super.getNetworks();

    let responses = await inquirer.prompt([
      {
        name: 'name',
        message: 'Enter account name:',
        default: args.name,
        type: 'input',
      },
      {
        name: 'network',
        message: 'Select network:',
        type: 'list',
        choices: networks.map(network => {
          return {
            name: network.title,
            value: network,
          };
        }),
      },
      {
        name: 'passphrase',
        message: 'Enter passphrase',
        type: 'password',
        mask: true,
      },
    ]);

    this.log('Trying to generate wallet...');
    const zilliqa = new Zilliqa(responses.network.apiAddress);
    const address = await zilliqa.wallet.create();

    this.log(`Wallet successfully generate with address: ${address}.`);
    this.log('Trying to encrypt wallet with provided passphrase and scrypt method...');
    const wallet = await zilliqa.wallet.export(address, responses.passphrase, 'scrypt');
    this.log('Successfully encrypted, now saving to wallet manager.');

    // Save account to local wallet
    await super.importAccount({
      name: slugify(responses.name),
      address: address,
      network: responses.network,
      data: JSON.parse(wallet),
    });
  }
}

WalletCreateCommand.description = `Describe the command here
...
Extra documentation goes here
`;

WalletCreateCommand.args = [
  {
    name: 'name',
    description: 'Wallet name used across the CLI',
  },
];

module.exports = WalletCreateCommand;
