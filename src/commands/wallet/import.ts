import { Command, flags } from "@oclif/command";

import * as Zilcli from "../../base";
import * as inquirer from "inquirer";
import chalk from 'chalk';
import slugify from 'slugify';

import { Zilliqa } from "@zilliqa-js/zilliqa";

import { toBech32Address } from "@zilliqa-js/crypto";


class WalletImportCommand extends Command {
  description = `Import wallet
You can import wallet accounts from keystore file or by Private Key
Keystore file must be located in $HOME/.zilcli/ directory.
`;

  args = [
    {
      name: 'name',
      description: 'Account name',
      default: 'default',
    },
    {
      name: 'privateKey',
      description: 'File path / Private Key / Mnemonic phrase',
    },
  ];

  flags = {
    type: flags.string({
      description: 'import type',
      options: ['keystore', 'privateKey'],
      default: 'privateKey',
    }),
  };

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const { args, flags } = this.parse(WalletImportCommand);

    let type = flags.type;

    let typeMessage = type === 'keystore' ? 'file name' : 'Private Key';

    let responses: { name: string, file: string, passphrase: string } = await inquirer.prompt([
      {
        name: 'name',
        message: 'Enter account name:',
        default: args.name,
        type: 'input',
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
        mask: '*',
      },
    ]);

    this.log('Trying to import wallet...');
    const zilliqa = new Zilliqa(base.apiAddress);

    if (type === 'keystore') {
      try {
        const fileData = await base.readJsonFile(responses.file);

        const address = await zilliqa.wallet.addByKeystore(JSON.stringify(fileData), responses.passphrase);
        const exportedWallet = await zilliqa.wallet.export(address, responses.passphrase, 'scrypt');

        this.log('Successfully encrypted, now saving to Zilcli manager.');

        // Save account to local wallet
        await base.importAccount({
          name: slugify(responses.name),
          address: address,
          network: base.apiAddress,
          data: JSON.parse(exportedWallet),
          imported: true,
          importType: type,
        });
      } catch (error) {
        this.error(error);
      }
    } else {
      // Sanitize Private Key
      let privateKey = base.remove0x(responses.file);

      const address = await zilliqa.wallet.addByPrivateKey(privateKey);
      const exportedWallet = await zilliqa.wallet.export(address, responses.passphrase, 'scrypt');

      this.log('Successfully encrypted, now saving to wallet manager.');

      // Save account to local wallZFet
      await base.importAccount({
        name: slugify(responses.name),
        address: address,
        network: base.apiAddress,
        data: JSON.parse(exportedWallet),
        imported: true,
        importType: type,
      });
    }
  }
}

export = WalletImportCommand;
