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

    const accounts: Zilcli.Account[] = await base.getAccounts();

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
        get: (item: Zilcli.Account) => chalk.yellow(item.name),
      },
      address: {
        get: (item: Zilcli.Account) => chalk.bold.green(toBech32Address(item.address)),
      },
      network: {
        get: (item: Zilcli.Account) => item.network,
      },
      id: {
        get: (item: Zilcli.Account) => item.data.id,
        extended: true,
      },
    });
  }

}

export = WalletListCommand;
