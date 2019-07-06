import { Command, flags } from "@oclif/command";

import * as Zilcli from '../../base';

import * as inquirer from 'inquirer';
import chalk from 'chalk';

const { cli } = require('cli-ux');

import { Zilliqa } from '@zilliqa-js/zilliqa';
import { BN, units, Long } from '@zilliqa-js/util';
import { Transaction } from '@zilliqa-js/account';

class TxSendCommand extends Command {
  static description = `Create and send a transaction

`;

  static flags = {
    from: flags.string({ char: 'f', description: 'account name or privateKey' }),
    to: flags.string({ char: 't', description: 'destination address' }),
    amount: flags.string({ char: 'a', description: 'amount in ZIL' }),
    gas: flags.integer({ char: 'g', description: 'gas to use (defined in Li)' }),
    usePrivateKey: flags.boolean({ char: 'p', description: 'Private Key' }),
  };

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const { flags } = this.parse(TxSendCommand);

    let { to, amount, gas, usePrivateKey } = flags;
    let from: string = flags.from || '';
    let privateKey: string = '';
    let passphrase: string = '';
    let account: Zilcli.Account;

    // Ask for private key if needed or set the account from accounts file
    if (usePrivateKey === true) {
      let response: { value: string } = await inquirer.prompt([
        {
          name: 'value',
          message: 'Enter your Private Key',
          type: 'input'
        },
      ]);

      privateKey = response.value;

    } else {
      const accounts = base.accounts;

      let responses: { account: string, passphrase: string } = await inquirer.prompt([
        {
          name: 'account',
          message: 'Select account used',
          type: 'list',
          choices: accounts.map(item => item.name),
        },
        {
          name: 'passphrase',
          message: 'Enter passphrase',
          mask: '*',
          type: 'password',
        },
      ])

      from = responses.account;
      passphrase = responses.passphrase;
    }

    // Initialize zilliqa and wallet
    const zilliqa = new Zilliqa(base.apiAddress);

    const internalFrom = base.getAccountByName(from);

    const internalAccount = (usePrivateKey === true)
      ? await zilliqa.wallet.addByPrivateKey(privateKey)
      : await zilliqa.wallet.addByKeystore(JSON.stringify(internalFrom.data), passphrase);


    if (to === undefined || base.validateAddress(to) === false) {
      let response: { value: string } = await inquirer.prompt([
        {
          name: 'value',
          message: 'Enter destination address or contact name',
          type: 'input',
        },
      ]);

      to = response.value;
    }

    const validated = base.validateAddress(to);

    if (validated === false) {
      console.error('Destination address could not be validated.');
    } else {
      to = validated.toString();
    }

    if (amount === undefined) {
      let response: { value: string } = await inquirer.prompt([
        {
          name: 'value',
          message: 'Enter amount (in ZIL)',
          type: 'input',
          validate: base.isNumeric,
        },
      ]);

      amount = response.value;
    }

    let response: { value: boolean } = await inquirer.prompt([
      {
        name: 'value',
        message: `Confirm that you wish to send ${chalk.bold.green(amount)} ZIL to ${chalk.bold.green(to)}:`,
        type: 'confirm',
      },
    ]);

    const confirmed = response.value;

    if (confirmed === false) {
      this.log('OK. Goodbye');
      this.exit(1);
    }

    try {
      // Get Account balance
      const balance = await zilliqa.blockchain.getBalance(internalAccount);

      if (balance.result === undefined) {
        this.error('Account balance is undefined');
      }

      // Calculate gas prices
      const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
      const liGasPrice = units.fromQa(new BN(minGasPrice.result), units.Units.Li);
      this.log(`Mininum gas price on the network ${liGasPrice} Li`);

      // Calculate needed amount
      if (gas === undefined) {
        let response: { value: string } = await inquirer.prompt([
          {
            name: 'value',
            message: 'Enter gas amount (in Li)',
            type: 'input',
            default: liGasPrice,
            validate: val => {
              if (base.isNumeric(val) === false) return 'Gas amount must be a number';
              /* if (units.toQa(val, units.Units.Li).gte(new BN(minGasPrice.result) === false))
                return 'Gas amount should be bigger or equal to minimum gas price'; */

              return true;
            }
          },
        ]);

        gas = parseInt(response.value, 10);
      }

      // Convert gas to Qa and check if is bigger than minimum gas price
      const myGasPrice = units.toQa(gas, units.Units.Li);

      cli.action.start('Generating and sending transaction');

      const sendTx: Transaction = await zilliqa.blockchain.createTransaction(
        zilliqa.transactions.new({
          version: base.nodeVersion,
          toAddr: to,
          amount: new BN(units.toQa(amount, units.Units.Zil)), // Sending an amount in Zil (1) and converting the amount to Qa
          gasPrice: myGasPrice, // Minimum gasPrice veries. Check the `GetMinimumGasPrice` on the blockchain
          gasLimit: Long.fromNumber(1),
        })
      );

      cli.action.stop('Transaction successfully sent');

      await cli.url('[Open Explorer] ', `https://viewblock.io/zilliqa/tx/${sendTx.id}`);

      this.log(sendTx.receipt);
    } catch (error) {
      this.error(error);
    }
  }
}


module.exports = TxSendCommand;
