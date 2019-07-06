import { Command } from "@oclif/command";

import * as Zilcli from "../../base";
import * as inquirer from "inquirer";

class WalletExportCommand extends Command {

  static description = `Export account to keystore file
Export wallet account to keystore file encoded with passphrase.
`;

  static args = [
    {
      name: 'name',
      description: 'account name you want to export',
    },
  ];

  async run() {
    const base = new Zilcli.Base(this.config.home);

    const { args } = this.parse(WalletExportCommand);


    let name = args.name;

    if (name === undefined) {
      const accounts = await base.getAccounts();

      const response: { value: string } = await inquirer.prompt([
        {
          name: 'value',
          message: 'Select account',
          type: 'list',
          choices: accounts.map((account: Zilcli.Account) => account.name),
        },
      ]);

      name = response.value;
    }

    try {
      const account = await base.getAccountByName(name);

      await base.exportAccount(account);
    } catch (error) {
      console.log(error);
    }
  }
}



export = WalletExportCommand;
