import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
/* tslint:disable-next-line */
import { validation } from "@zilliqa-js/util";
import { toBech32Address, fromBech32Address } from '@zilliqa-js/crypto';

import { Namicorn } from "namicorn";

export interface Account {
  name: string;
  address: string;
  network: string;
  data: any,
  imported?: boolean,
  importType?: string
}

export interface Contact {
  name: string;
  address: string;
}

export class Base {
  homePath: string;
  apiAddress: string = 'https://api.zilliqa.com';
  nodeVersion: number = 65537;
  contacts: Contact[] = [];
  accounts: Account[] = [];

  constructor(homePath: string) {
    this.homePath = homePath;

    this.accounts = this.readJsonFile('accounts.json') || [];

    this.contacts = this.readJsonFile('contacts.json') || [];
  }

  /* TODO: MOVE THIS TO UTILS NAMESPACE */
  remove0x(string: string): string {
    return string.replace('0x', '');
  };

  add0x = (string: string): string => {
    return '0x' + string;
  };

  async validateAddress(string: string) {

    // Try to resolve a domain

    try {
      const namicorn = new Namicorn();
      if (namicorn.isValidDomain(string)) {
        const domainResult = await namicorn.address(string, 'ZIL');

        if (domainResult !== null) {
          console.log(`${string} contact resolves to ${domainResult}`);
        }
      }
    } catch (error) {

    }


    // Try to resolve a local contact
    try {
      let contact = this.contacts.find((item: Contact) => item.name === string);
      if (contact !== undefined) {
        console.log(`${string} contact resolves to ${contact.address}`);
        if (validation.isAddress(fromBech32Address(contact.address))) {
          return contact.address;
        }
      }
    } catch (error) {

    }

    // Try to validate bech32 address
    if (validation.isAddress(fromBech32Address(string))) {
      return string;
    }

    return false;
  }

  isNumeric = (n: any) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };


  readJsonFile(fileName: string) {
    return fs.readJSONSync(path.join(this.homePath, '.zilcli', fileName), {
      throws: false,
    });
  }

  writeJsonFile(fileName: string, contents: object) {
    return fs.outputJsonSync(path.join(this.homePath, '.zilcli', fileName), contents);
  }

  getAccounts(): Account[] {
    // Read accounts from file
    let accounts = this.readJsonFile('accounts.json') || [];

    this.accounts = accounts;
    return accounts;
  }

  getAccountByName(name: string): Account {

    let account: Account | undefined = this.accounts.find((item: Account) => item.name === name);

    if (account === undefined) {
      throw chalk.bold.red(`Account called ${name} does not exist.`);
    }

    return account;
  }

  async removeAccount(name: string) {
    try {
      let accountIndex: number | undefined = this.accounts.findIndex((item: Account) => item.name === name);

      if (accountIndex === -1) {
        throw chalk.bold.red(`Account called ${name} does not exist.`);
      }

      this.accounts.splice(accountIndex, 1);

      try {
        // Rewrite accounts.json file
        await fs.outputJson(path.join(this.homePath, '/.zilcli/accounts.json'), this.accounts);

        console.log(chalk.green.bold(`Account ${name} successfully removed.`));
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async importAccount(account: Account) {
    const accounts = this.accounts;

    // check if already imported
    let found = accounts.find((item: Account) => item.address === account.address);

    if (found !== undefined) {
      throw `Account already imported with the name ${chalk.bold.yellow(found.name)} (${chalk.bold.green(
        found.address
      )})`;
    }

    accounts.push(account);
    this.accounts = accounts; // TODO: use only this.accounts

    try {
      // Rewrite accounts.json file
      await fs.outputJson(path.join(this.homePath, '/.zilcli/accounts.json'), accounts);

      console.log(chalk.green.bold(`Account ${account.name} successfully imported.`));
    } catch (error) {
      throw error;
    }
  }

  async exportAccount(account: Account) {
    try {
      await this.writeJsonFile(`${account.name}.json`, account.data);

      console.log(
        chalk.bold.green(`Account successfully exported to ${this.homePath}/.zilcli/${account.name}.json`)
      );
    } catch (error) {
      throw error;
    }
  }

  getContacts(): Contact[] {
    // Read contacts from file
    let contacts = this.readJsonFile('contacts.json') || [];

    this.contacts = contacts;
    return contacts;
  }

  getContactByName(name: string) {
    let contact: Contact | undefined = this.contacts.find((item: Contact) => item.name === name);

    if (contact === undefined) {
      throw chalk.bold.red(`Contact with name ${name} does not exist in AddressBook.`);
    }

    return contact;
  }

  getContactByAddress(address: string) {
    let contact: Contact | undefined = this.contacts.find((item: Contact) => item.address === address);

    if (contact === undefined)
      return false;
    else
      return contact;
  }

  addContact(contact: Contact) {
    // check if already imported
    let found = this.contacts.find((item: Contact) => (item.address === contact.address || item.name === contact.name));

    if (found !== undefined) {
      throw `Account with the name ${chalk.bold.yellow(found.name)} already exists. (${chalk.bold.green(
        found.address
      )})`;
    }

    this.contacts.push(contact);

    this.writeJsonFile('contacts.json', this.contacts);

    console.log(chalk.green.bold(`Contact ${contact.name} successfully saved.`));
  }

  async removeContact(name: string) {
    try {
      let contactIndex: number | undefined = this.contacts.findIndex((item: Contact) => item.name === name);

      if (contactIndex === -1) {
        throw chalk.bold.red(`Contact ${name} does not exist.`);
      }

      this.contacts.splice(contactIndex, 1);

      try {
        // Rewrite contacts.json file
        await fs.outputJson(path.join(this.homePath, '/.zilcli/contacts.json'), this.contacts);

        console.log(chalk.green.bold(`Contact ${name} successfully removed.`));
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

}

