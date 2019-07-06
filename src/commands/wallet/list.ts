import { Command } from "@oclif/command";
import { cli } from "cli-ux";
import chalk from 'chalk';
import * as Zilcli from "../../base";
import { toBech32Address } from '@zilliqa-js/crypto';

class WalletListCommand extends Command {
  static description = `Lists all configured Zilliqa Wallets
Prints a table with all the configured Wallet Accounts.
ID, Name, Address, Balance`;

  async run() {
    const base = new Zilcli.Base(this.config.home);

    const accounts = base.accounts;

    if (accounts.length === 0) {
      this.warn('You have no wallet accounts defined.');
      this.log(
        `You can create a new wallet using ${chalk.bold(
          'zilcli wallet:create'
        )} or import one using ${chalk.bold('zilcli wallet:import')}`
      );
      this.exit(1);
    }

    cli.table(accounts, {
      name: {
        minWidth: 10,
        get: item => chalk.yellow(item.name),
      },
      address: {
        get: (item) => chalk.bold.green(toBech32Address(item.address)),
      },
      old_address: {
        get: item => item.address
      },
      network: {
        get: (item) => item.network,
      },
      id: {
        get: (item) => item.data.id,
        extended: true,
      },
    });
  }

}

export = WalletListCommand;
