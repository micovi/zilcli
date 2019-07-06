import { Command } from "@oclif/command";

import * as Zilcli from "../../base";
import * as inquirer from "inquirer";

class ContactsRemoveCommand extends Command {
  static description = `Remove existing Contact from Address Book
...
`;

  static args = [
    {
      name: 'name',
      description: 'contact name you want to remove',
    },
  ];

  async run() {
    const base = new Zilcli.Base(this.config.home);

    let { args } = this.parse(ContactsRemoveCommand);

    if (args.name === undefined) {
      const response: { value: string } = await inquirer.prompt([
        {
          name: 'value',
          message: 'Select account',
          type: 'list',
          choices: base.accounts.map(account => account.name),
        },
      ]);

      args.name = await response.value;
    }

    try {
      await base.removeContact(args.name);
    } catch (error) {
      console.error(error);
    }

  }


}



module.exports = ContactsRemoveCommand;
