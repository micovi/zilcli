const {Command, flags} = require('@oclif/command');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

class ZilliqaBase extends Command {
  async readJsonFile(fileName) {
    try {
      let data = await fs.readJSON(path.join(this.config.home, '.zilcli', fileName), {
        throws: false,
      });

      return data;
    } catch (error) {
      this.error(error);
    }
  }

  async writeJsonFile(fileName, contents) {
    try {
      let data = await fs.writeJSON(path.join(this.config.home, '.zilcli', fileName), contents);

      return data;
    } catch (error) {
      this.error(error);
    }
  }

  async getAccounts() {
    try {
      try {
        // Ensure the accounts.json file exists
        await fs.ensureFile(path.join(this.config.home, '/.zilcli/accounts.json'));
      } catch (error) {
        this.error(error);
      }

      // Read accounts from file
      let accounts = await this.readJsonFile('accounts.json');

      if (accounts === null) accounts = [];

      return accounts;
    } catch (error) {
      this.error(error);
    }
  }

  async getAccount(name) {
    const accounts = await this.getAccounts();

    let account = accounts.find(item => item.name === name);

    if (account === undefined) {
      this.error(chalk.bold.red(`Account called ${name} does not exist.`));
    }

    return account;
  }

  async getDefaultAccount() {
    const accounts = await this.getAccounts();

    let found = accounts.find(item => item.default === true);

    return found;
  }

  async importAccount(account) {
    const accounts = await this.getAccounts();

    // check if already imported
    let found = accounts.find(item => item.address === account.address);

    if (found === undefined) {
      accounts.push(account);

      try {
        // Rewrite accounts.json file
        await fs.writeJSON(path.join(this.config.home, '/.zilcli/accounts.json'), accounts);

        this.log(chalk.green.bold(`Account ${account.name} successfully imported.`));
      } catch (error) {
        this.error(error);
      }
    } else {
      this.warn(
        `Account already imported with the name ${chalk.bold.yellow(found.name)} (${chalk.bold.green(
          found.address
        )})`
      );
    }
  }

  getNetworks() {
    return [
      {
        id: 1,
        title: 'mainnet',
        version: 65537,
        apiAddress: 'https://api.zilliqa.com',
      },
      {
        id: 2,
        title: 'testnet',
        version: 21823489,
        apiAddress: 'https://dev-api.zilliqa.com',
      },
    ];
  }

  async run() {
    // Parse flags
    const {flags} = this.parse(ZilliqaBase);
    this.flags = flags;
  }
}

ZilliqaBase.flags = {
  loglevel: flags.string({options: ['error', 'warn', 'info', 'debug']}),
};

module.exports.default = ZilliqaBase;
