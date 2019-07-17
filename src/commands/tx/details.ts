import { Command } from "@oclif/command";
import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';
//import { cli } from "cli-ux";

class TxDetailsCommand extends Command {
  static description = `Returns the details of a specified Transaction.
...

`;

  static args = [
    {
      name: 'txhash',
      description: 'Transaction hash you want to get details for',
    }
  ]

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const { args } = this.parse(TxDetailsCommand);

    try {
      const txn = await zilliqa.blockchain.getTransaction(args.hash);

      console.log(txn);

    } catch (error) {
      console.error(error);
    }

  }
}

export = TxDetailsCommand;
