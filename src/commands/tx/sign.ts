import { Command, flags } from "@oclif/command";
import * as fs from "fs-extra";

import * as Zilcli from '../../base';

import * as inquirer from 'inquirer';

const txnEncoder = require('@zilliqa-js/account/dist/util').encodeTransactionProto;

import chalk from 'chalk';

const { cli } = require('cli-ux');

import { Zilliqa } from '@zilliqa-js/zilliqa';
/* tslint:disable-next-line */
import { BN, units, Long } from '@zilliqa-js/util';
import { Transaction } from '@zilliqa-js/account';

class TxSignCommand extends Command {
  static description = `Sign a transaction
`;

  static flags = {
    from: flags.string({ char: 'f', description: 'account name or privateKey' }),
    usePrivateKey: flags.boolean({ char: 'p', description: 'Private Key' }),
  };

  static args = [
    {
        name: 'init',
      description: 'Absolute file path for init.json',
      required: true
    },
    {
      name: 'output',
      description: 'Absolute file path for output.json',
      required: true
    },
    {
      name: 'contract',
      description: 'Absolute file path for contract.scilla',
      required: false,
      default: undefined
    },
  ];

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const { flags, args } = this.parse(TxSignCommand);

    let { usePrivateKey } = flags;
    let {init, contract, output} = args;
    let from: string = flags.from || '';
    let privateKey: string = '';
    let passphrase: string = '';

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

    try {


      const initData = fs.readJSONSync(init, {
        throws: true,
      });


      // Convert to Zilliqa types
      if (!(initData.amount instanceof BN)) {
        initData.amount = new BN(initData.amount);
      }

      if (!(initData.gasPrice instanceof BN)) {
        initData.gasPrice = new BN(initData.gasPrice);
      }

      if (!(initData.gasLimit instanceof Long)) {
        initData.gasLimit = Long.fromNumber(initData.gasLimit);
      }

      if (contract !== undefined) {
        const contractData = fs.readFileSync(contract, 'utf8');

        initData.code = contractData.replace(/\n/g,"");
       }

      initData.data = JSON.stringify(initData.data).replace(/\\"/g, '"');

      const encoded = txnEncoder(initData);

      if(zilliqa.wallet.defaultAccount !== undefined) {
      const signature = await zilliqa.wallet.defaultAccount.signTransaction(encoded);

      console.log('Signature: ', signature);

      initData.signature = signature;

      fs.writeJSONSync(output, initData);

      console.log('Transaction successfully generated in: ', output);
      }
    } catch (error) {
      this.error(error);
    }
  }
}


module.exports = TxSignCommand;
