import { Command } from "@oclif/command";
import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';
import "babel-polyfill";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { BN, units, Long } from '@zilliqa-js/util';

/* tslint:disable-next-line */
const Z = require("../../ledger-interface").default;

async function open() {
  try {
    // This might throw if device not connected via USB
    const t = await TransportNodeHid.open("");
    return t;
  } catch (error) {
    throw Error('Please check your Ledger Device is connected and unlocked.');
  }
}

class LedgerAccountCommand extends Command {
  static description = `Displays details of Ledger Account`;


  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const transport = await open();

    if (transport instanceof Error) {
      //console.error('Please check your Ledger Device is connected.');
      this.error(transport.message)
    }

    const zil = new Z(transport);

    try {
      const address = await zil.getPublicAddress(0);

      this.log(`Account address is ${address}`);

      let balance = await zilliqa.blockchain.getBalance(address);

      if (balance.error && balance.error.code === -5) {
        this.error('Account has no balance.');
      } else {
        let amount = units.fromQa(new BN(balance.result.balance), units.Units.Zil);

        console.log(`Account balance ${amount} ZIL`);
      }

    } catch (error) {
      this.error(error);
    }
  }

}

export = LedgerAccountCommand;
