const ZilliqaBase = require('../../base').default;

const {cli} = require('cli-ux');
const chalk = require('chalk');

class WalletListCommand extends ZilliqaBase {
  async run() {
    const accounts = await super.getAccounts();

    if (accounts.length === 0) {
      this.warn('You have no wallet accounts defined.');
      this.log(
        `You can create a new wallet using ${chalk.bold(
          'zilcli wallet:create'
        )} or import one using ${chalk.bold('zilcli wallet:import')}`
      );
    } else {
      cli.table(accounts, {
        name: {
          minWidth: 10,
          get: item => chalk.yellow(item.name),
        },
        address: {
          get: item => chalk.bold.green(item.address),
        },
        network: {
          get: item => item.network.title,
        },
        id: {
          get: item => item.data.id,
          extended: true,
        },
      });
    }
  }
}

WalletListCommand.description = `Lists all configured Zilliqa Wallets
Prints a table with all the configured Wallet Accounts.
ID, Name, Address, Balance
`;

module.exports = WalletListCommand;
