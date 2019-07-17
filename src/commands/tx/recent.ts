import { Command } from "@oclif/command";

import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';
import { BN, units, Long } from '@zilliqa-js/util';
//import { cli } from "cli-ux";

class TxRecentCommand extends Command {
  static description = `Retrieve a list with recent 100 transactions
...

`;

  static args = [
    {
      name: 'limit',
      description: 'Limit',
    }
  ]

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const { args } = this.parse(TxRecentCommand);

    try {
      const txs = await zilliqa.blockchain.getRecentTransactions();

      console.log('Parsing blockchain data...');

      if (txs.result !== undefined) {

        let txdetails = txs.result.TxnHashes.map(async (txhash: string) => {
          let data = await zilliqa.blockchain.getTransaction(txhash);

          let amount = new BN(units.fromQa(data.txParams.amount, units.Units.Zil)).toString();

          return {
            hash: txhash,
            from: data.senderAddress,
            to: data.txParams.toAddr,
            amount: amount,
            receipt: data.txParams.receipt,
            status: data.status
          };
        });

        const finished = await Promise.all(txdetails);

       console.log(finished);
      }

    } catch (error) {
      console.error(error);
    }

  }
}

export = TxRecentCommand;
