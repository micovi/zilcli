const ZilliqaBase = require('../../base').default;

const inquirer = require('inquirer');
const chalk = require('chalk');

class WalletExportCommand extends ZilliqaBase {
  async run() {
    const {args} = this.parse(WalletExportCommand);
    let name = args.name;
    let account;

    if (name === undefined) {
      const accounts = await super.getAccounts();

      name = (await inquirer.prompt([
        {
          name: 'value',
          message: 'Select account',
          type: 'list',
          choices: accounts.map((account, index) => {
            return {name: account.name, value: index};
          }),
        },
      ])).value;

      account = accounts[name];
    } else {
      account = await super.getAccount(name);
    }

    try {
      await super.writeJsonFile(`${account.name}.json`, account.data);

      this.log(
        chalk.bold.green(`Account successfully exported to ${this.config.home}/.zilcli/${account.name}.json`)
      );
    } catch (error) {
      this.error(error);
    }
  }
}

WalletExportCommand.description = `Export account to keystore file
Export wallet account to keystore file encoded with passphrase.
`;

WalletExportCommand.args = [
  {
    name: 'name',
    description: 'account name you want to export',
  },
];

module.exports = WalletExportCommand;
