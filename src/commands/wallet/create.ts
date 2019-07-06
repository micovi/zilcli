import { Command } from "@oclif/command";

import * as inquirer from 'inquirer';
import slugify from 'slugify';
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { toBech32Address } from '@zilliqa-js/crypto';

import * as Zilcli from "../../base";


class WalletCreateCommand extends Command {

  description = `Describe the command here
...
Extra documentation goes here
`;

  args = [
    {
      name: 'name',
      description: 'Wallet name used across the CLI',
    },
  ];

  async run() {
    const base = new Zilcli.Base(this.config.home);

    const { args } = this.parse(WalletCreateCommand);

    let responses: { name: string, passphrase: string } = await inquirer.prompt([
      {
        name: 'name',
        message: 'Enter account name:',
        default: args.name,
        type: 'input',
      },
      {
        name: 'passphrase',
        message: 'Enter passphrase',
        type: 'password',
        mask: "*",
      },
    ]);

    this.log('Trying to generate wallet...');

    const zilliqa = new Zilliqa(base.apiAddress);

    const address = await zilliqa.wallet.create();

    this.log(`Wallet successfully generate with address: ${toBech32Address(address)}.`);
    this.log('Trying to encrypt wallet with provided passphrase and scrypt method...');
    const wallet = await zilliqa.wallet.export(address, responses.passphrase, 'scrypt');
    this.log('Successfully encrypted, now saving to wallet manager.');

    // Save account to local wallet TODO: TRYCATCH
    await base.importAccount({
      name: slugify(responses.name),
      address: address,
      network: base.apiAddress,
      data: JSON.parse(wallet),
    });
  }
}



export = WalletCreateCommand;
