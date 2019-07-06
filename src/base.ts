import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";

export interface Account {
  name: string;
  address: string;
  network: string;
  data: {
    id: string
  },
  imported?: boolean,
  importType?: string
}


export class Base {
  homePath: string;
  apiAddress: string = 'https://api.zilliqa.com';

  constructor(homePath: string) {
    this.homePath = homePath;
  }


  remove0x = (string: string): string => {
    return string.replace('0x', '');
  };

  add0x = (string: string): string => {
    return '0x' + string;
  };

  async readJsonFile(fileName: string) {
    try {
      let data = await fs.readJSON(path.join(this.homePath, '.zilcli', fileName), {
        throws: false,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async writeJsonFile(fileName: string, contents: object) {
    try {
      let data = await fs.writeJSON(path.join(this.homePath, '.zilcli', fileName), contents);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAccounts(): Promise<Account[]> {

    try {
      // Ensure the accounts.json file exists
      await fs.ensureFile(path.join(this.homePath, '/.zilcli/accounts.json'));
    } catch (error) {
      throw error;
    }

    // Read accounts from file
    let accounts = await this.readJsonFile('accounts.json');

    if (accounts === null) accounts = [];

    return accounts;

  }

  async getAccountByName(name: string): Promise<Account> {
    const accounts = await this.getAccounts();

    let account: Account | undefined = accounts.find((item: Account) => item.name === name);

    if (account === undefined) {
      throw chalk.bold.red(`Account called ${name} does not exist.`);
    }

    return account;
  }

  async removeAccount(name: string) {
    try {
      const accounts = await this.getAccounts();
      let accountIndex: number | undefined = accounts.findIndex((item: Account) => item.name === name);

      if (accountIndex === undefined) {
        throw chalk.bold.red(`Account called ${name} does not exist.`);
      }

      accounts.splice(accountIndex, 1);

      try {
        // Rewrite accounts.json file
        await fs.writeJSON(path.join(this.homePath, '/.zilcli/accounts.json'), accounts);

        console.log(chalk.green.bold(`Account ${name} successfully removed.`));
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async importAccount(account: Account) {
    const accounts = await this.getAccounts();

    // check if already imported
    let found = accounts.find((item: Account) => item.address === account.address);

    if (found !== undefined) {
      throw `Account already imported with the name ${chalk.bold.yellow(found.name)} (${chalk.bold.green(
        found.address
      )})`;
    }

    accounts.push(account);

    try {
      // Rewrite accounts.json file
      await fs.writeJSON(path.join(this.homePath, '/.zilcli/accounts.json'), accounts);

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
}

