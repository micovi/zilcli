import { Command, flags } from "@oclif/command";
import "babel-polyfill";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import * as Zilcli from '../../base';

import axios from 'axios';

import * as inquirer from 'inquirer';
import chalk from 'chalk';

const { cli } = require('cli-ux');

import { Zilliqa } from '@zilliqa-js/zilliqa';
/* tslint:disable-next-line */
import { BN, units, Long } from '@zilliqa-js/util';
import { getAddressFromPublicKey, fromBech32Address, toBech32Address } from '@zilliqa-js/crypto';

/* tslint:disable-next-line */
const Z = require("../../ledger-interface").default;

async function open() {
  // This might throw if device not connected via USB
  const t = await TransportNodeHid.open("");
  return t;
}

class LedgerSendCommand extends Command {
  static description = `Create and send a transaction using the Ledger Device

`;

  static flags = {
    to: flags.string({ char: 't', description: 'destination address' }),
    amount: flags.string({ char: 'a', description: 'amount in ZIL' }),
    gas: flags.integer({ char: 'g', description: 'gas to use (defined in Li)' })
  };

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);
    const transport = await open();

    if (transport instanceof Error) {
      this.error(transport.message)
    }

    const zil = new Z(transport);

    const { flags } = this.parse(LedgerSendCommand);

    let { to, amount, gas } = flags;

    try {

      const pubkey = await zil.getPublicKey(1);

      const address = toBech32Address(getAddressFromPublicKey(pubkey));

      this.log(`Account address is ${address}`);
      this.log(`Account public key is ${pubkey}`);

      let balance = await zilliqa.blockchain.getBalance(address);

      if (balance.error && balance.error.code === -5) {
        this.error('Account has no balance.');
      } else {
        let balanceAmount = units.fromQa(new BN(balance.result.balance), units.Units.Zil);
        let nonce = parseInt(balance.result.nonce) + 1;

        console.log(`Account balance ${balanceAmount} ZIL`);


        if (to === undefined || ((await base.validateAddress(to)) === false)) {
          let response: { value: string } = await inquirer.prompt([
            {
              name: 'value',
              message: 'Enter destination address or contact name',
              type: 'input',
            },
          ]);

          to = response.value;
        }

        const validated = await base.validateAddress(to);

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

        // Calculate gas prices
        const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
        const gasresult = minGasPrice.result || 0;
        const liGasPrice = units.fromQa(new BN(gasresult), units.Units.Li);
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

        // Convert address to old format
        to = fromBech32Address(to);

        const txParams = {
          version: base.nodeVersion,
          nonce: nonce,
          toAddr: to,
          amount: new BN(units.toQa(amount, units.Units.Zil)), // Sending amount in Zil (1) and converting the amount to Qa
          pubKey: pubkey,
          gasPrice: myGasPrice, // in Qa
          gasLimit: Long.fromNumber(1),
          signature: ''
        };

        let signed = await zil.signTxn(1, txParams);

        txParams.signature = signed.sig;

        cli.action.start('Generating and sending transaction');

        const newtx = await axios.post(base.apiAddress, {
          id: "1",
          jsonrpc: "2.0",
          method: "CreateTransaction",
          params: [{
            version: base.nodeVersion,
            nonce: nonce,
            toAddr: to,
            amount: new BN(units.toQa(amount, units.Units.Zil)).toString(),
            pubKey: pubkey,
            gasPrice: myGasPrice.toString(),
            gasLimit: "1",
            code: "",
            data: "",
            signature: signed.sig,
            priority: false
          }]
        });

        cli.action.stop('Transaction successfully sent');

        console.log(newtx.data);

      }

    } catch (error) {
      this.error(error);
    }
  }
}


module.exports = LedgerSendCommand;
