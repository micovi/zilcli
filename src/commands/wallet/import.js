const ZilliqaBase = require('../../base').default;
const {flags} = require('@oclif/command');
const inquirer = require('inquirer');
const slugify = require('slugify');

const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {remove0x} = require('../../utils/blockchain');

class WalletImportCommand extends ZilliqaBase {
  async run() {
    const {args, flags} = this.parse(WalletImportCommand);
    const networks = super.getNetworks();

    let type = flags.type;

    let typeMessage = type === 'keystore' ? 'file name' : 'Private Key';

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
        name: 'file',
        message: `Enter ${typeMessage}`,
        type: 'input',
        default: args.privateKey,
      },
      {
        name: 'passphrase',
        message: 'Enter passphrase',
        type: 'password',
        mask: true,
      },
    ]);

    this.log('Trying to import wallet...');
    const zilliqa = new Zilliqa(responses.network.apiAddress);

    if (type === 'keystore') {
      try {
        const fileData = await super.readJsonFile(responses.file);

        const address = await zilliqa.wallet.addByKeystore(JSON.stringify(fileData), responses.passphrase);
        const exportedWallet = await zilliqa.wallet.export(address, responses.passphrase, 'scrypt');

        this.log('Successfully encrypted, now saving to wallet manager.');

        // Save account to local wallet
        await super.importAccount({
          name: slugify(responses.name),
          address: address,
          network: responses.network,
          data: JSON.parse(exportedWallet),
          imported: true,
          importType: responses.type,
        });
      } catch (error) {
        this.error(error);
      }
    } else {
      // Sanitize Private Key
      let privateKey = remove0x(responses.file);

      const address = await zilliqa.wallet.addByPrivateKey(privateKey);
      const exportedWallet = await zilliqa.wallet.export(address, responses.passphrase, 'scrypt');

      this.log('Successfully encrypted, now saving to wallet manager.');

      // Save account to local wallet
      await super.importAccount({
        name: slugify(responses.name),
        address: address,
        network: responses.network,
        data: JSON.parse(exportedWallet),
        imported: true,
        importType: responses.type,
      });
    }
  }
}

WalletImportCommand.description = `Import wallet
You can import wallet accounts from keystore file or by Private Key
Keystore file must be located in $HOME/.zilcli/ directory.
`;

WalletImportCommand.args = [
  {
    name: 'name',
    description: 'Account name',
    default: 'default',
  },
  {
    name: 'privateKey',
    description: 'File path / Private Key',
  },
];

WalletImportCommand.flags = {
  type: flags.string({
    description: 'import type',
    options: ['keystore', 'privateKey'],
    default: 'privateKey',
  }),
};

module.exports = WalletImportCommand;
