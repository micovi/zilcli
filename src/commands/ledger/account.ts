import { Command } from "@oclif/command";
import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';
import Ledger from '../../ledger';
import { BN, units, Long } from '@zilliqa-js/util';

class LedgerAccountCommand extends Command {
  static description = `Lists all configured Zilliqa Wallets
Prints a table with all the configured Wallet Accounts.
ID, Name, Address, Balance`;


  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const ledger = new Ledger();

    try {
      const address = await ledger.getAddress(1);

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
