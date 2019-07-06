import { Command } from "@oclif/command";

import * as inquirer from 'inquirer';
import * as Zilcli from "../../base";


class ContactsAddCommand extends Command {

  static description = `Describe the command here
...
Extra documentation goes here
`;

  static args = [
    {
      name: 'address',
      description: 'Contact address',
    },
    {
      name: 'name',
      description: 'Contact name',
    },
  ];

  async run() {
    const base = new Zilcli.Base(this.config.home);

    const { args } = this.parse(ContactsAddCommand);

    let responses: { name: string, address: string } = await inquirer.prompt([
      {
        name: 'address',
        message: 'Enter contact address:',
        default: args.address,
        type: 'input',
      },
      {
        name: 'name',
        message: 'Enter contact name:',
        default: args.name,
        type: 'input',
      }
    ]);

    // Save account to local wallet TODO: TRYCATCH
    try {
      base.addContact({
        name: responses.name,
        address: responses.address
      });
    } catch (error) {
      console.error(error);
    }

  }
}



export = ContactsAddCommand;
