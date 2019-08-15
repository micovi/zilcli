import { Command } from "@oclif/command";
import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { BN, units, Long } from '@zilliqa-js/util';

/* tslint:disable-next-line */
const Z = require("../../ledger-interface").default;

async function open() {
  // This might throw if device not connected via USB
  const t = await TransportNodeHid.open("");
  return t;
}

class LedgerAccountCommand extends Command {
  static description = `Lists all configured Zilliqa Wallets
Prints a table with all the configured Wallet Accounts.
ID, Name, Address, Balance`;


  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const transport = await open();

    if (transport instanceof Error) {
      this.error(transport.message)
    }

    const zil = new Z(transport);

    try {
      const address = await zil.getAddress(1);

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
