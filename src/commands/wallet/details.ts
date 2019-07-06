import { Command } from "@oclif/command";

import * as Zilcli from "../../base";
import * as inquirer from "inquirer";
import chalk from 'chalk';

import { Zilliqa } from "@zilliqa-js/zilliqa";
import { toBech32Address } from "@zilliqa-js/crypto";
import { BN, units } from '@zilliqa-js/util';

class WalletDetailsCommand extends Command {
  async run() {
    const base = new Zilcli.Base(this.config.home);

    const { args } = this.parse(WalletDetailsCommand);

    let name = args.name;

    if (name === undefined) {
      const accounts = await base.getAccounts();

      let response: { name: string } = await inquirer.prompt([
        {
          name: 'name',
          message: 'Select account:',
          type: 'list',
          choices: accounts.map((account: Zilcli.Account) => account.name),
        },

      ]);

      name = response.name;
    }

    let response: { passphrase: string } = await inquirer.prompt([
      {
        name: 'passphrase',
        message: 'Enter passphrase',
        type: 'password',
        mask: '*',
      },
    ]);

    const passphrase = response.passphrase;

    try {
      const account = await base.getAccountByName(name);

      const zilliqa = new Zilliqa(base.apiAddress);

      const address = await zilliqa.wallet.addByKeystore(JSON.stringify(account.data), passphrase);
      const accountDetails = await zilliqa.wallet.accounts[address];
      const balanceData = await zilliqa.blockchain.getBalance(address);

      let balance: number | string = 0;

      if (balanceData.result !== undefined) {
        // Convert balance to Zil
        balance = units.fromQa(new BN(balanceData.result.balance), units.Units.Zil);
      }

      this.log(`Name ${chalk.yellow(account.name)}`);
      this.log(`ID: ${account.data.id}`);
      this.log(`Address: ${chalk.green.bold(toBech32Address(address))} (${address})`);
      this.log(`Balance: ${chalk.bold(balance + ' ZIL')}`);
      this.log('---');
      console.log(accountDetails);
      this.log('---');
      this.log('Network details:');
      this.log(account.network);

    } catch (error) {
      console.log(error);
    }

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

export = WalletDetailsCommand;
