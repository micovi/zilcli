import { Command } from "@oclif/command";

import * as Zilcli from "../../base";
import * as inquirer from "inquirer";

class WalletRemoveCommand extends Command {
  static description = `Remove existing wallet from Zilcli Manager
...
`;

  static args = [
    {
      name: 'name',
      description: 'account name you want to remove',
    },
  ];

  async run() {
    const base = new Zilcli.Base(this.config.home);

    let { args } = this.parse(WalletRemoveCommand);

    if (args.name === undefined) {
      const accounts = await base.getAccounts();
      const response: { value: string } = await inquirer.prompt([
        {
          name: 'value',
          message: 'Select account',
          type: 'list',
          choices: accounts.map((account: Zilcli.Account) => account.name),
        },
      ]);

      args.name = await response.value;
    }

    try {
      await base.removeAccount(args.name);
    } catch (error) {
      console.error(error);
    }

  }


}



module.exports = WalletRemoveCommand;
