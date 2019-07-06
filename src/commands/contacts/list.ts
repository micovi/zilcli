import { Command } from "@oclif/command";
import { cli } from "cli-ux";
import chalk from 'chalk';
import * as Zilcli from "../../base";
import { fromBech32Address } from '@zilliqa-js/crypto';

class ContactsListCommand extends Command {
  static description = `Lists all contacts from Address Book
Prints a table with all the saved accounts.
Name, Address, Old Address format`;

  async run() {
    const base = new Zilcli.Base(this.config.home);

    const contacts: Zilcli.Contact[] = base.contacts;

    if (contacts.length === 0) {
      this.warn('You have no contacts defined.');
      this.log(
        `You can create a new contact entry by using ${chalk.bold(
          'zilcli contacts:add'
        )}`
      );
      this.exit(1);
    }

    cli.table(contacts, {
      name: {
        minWidth: 10,
        get: item => chalk.yellow(item.name),
      },
      address: {
        get: item => chalk.bold.green(item.address),
      },
      old_address: {
        get: item => fromBech32Address(item.address)
      }
    });
  }

}

export = ContactsListCommand;
