import { Command, flags } from "@oclif/command";
import "babel-polyfill";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import * as Zilcli from '../../base';
import * as fs from "fs-extra";
import * as path from "path";
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

class LedgerSignCommand extends Command {
  static description = `Sign a tx json file with Ledger Device`;

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
    }
  ];

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);
    const transport = await open();

    if (transport instanceof Error) {
      this.error(transport.message)
    }

    const zil = new Z(transport);

    const { args } = this.parse(LedgerSignCommand);

    let { init, contract, output } = args;

    try {

      const pubkey = await zil.getPublicKey(0);

      const address = toBech32Address(getAddressFromPublicKey(pubkey));

      this.log(`Account address is ${address}`);
      this.log(`Account public key is ${pubkey}`);

      const initData = fs.readJSONSync(init, {
        throws: true,
      });

      const old = { ...initData };

      initData.data = JSON.stringify(initData.data).replace(/\\"/g, '"');

      if (contract !== undefined) {
        const contractData = fs.readFileSync(contract, 'utf8');

        initData.code = contractData.replace(/\n/g, "");
      }

      let signed = await zil.signTxn(0, { ...initData, pubKey: pubkey });

      initData.signature = signed.sig;

      fs.writeJSONSync(output, { ...initData, gasPrice: old.gasPrice.toString(), gasLimit: old.gasLimit.toString(), amount: old.amount.toString(), priority: false, pubKey: pubkey });

      console.log('Transaction successfully signed and generated in: ', output);

    } catch (error) {
      this.error(error.message);
      this.error(error);
    }
  }
}


module.exports = LedgerSignCommand;
