import { Command, flags } from "@oclif/command";

import * as Zilcli from '../../base';

import fs from 'fs';
import readline from 'readline';

import { Zilliqa } from '@zilliqa-js/zilliqa';
/* tslint:disable-next-line */
import { BN, units, Long } from '@zilliqa-js/util';
import { Transaction } from '@zilliqa-js/account';
import Listr from 'listr';

class TxBatchSendCommand extends Command {
  static description = `Create and send batch transactions
Batch file format should contain private key, destination and amount used to send.

File format example:
privatekey destination 10
privatekey destination all
privatekey destination 0.5
`;

  static flags = {
    to: flags.string({ char: 't', description: 'destination address', required: true }),
    file: flags.string({ char: 'f', description: 'transactions file path', required: true }),
    gasprice: flags.integer({ description: 'gas price (in Qa)' })
  };

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const { flags } = this.parse(TxBatchSendCommand);

    // Calculate gas prices
    const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
    let gasresult = minGasPrice.result || 0;

    if (flags.gasprice !== undefined && flags.gasprice !== 0) {
      gasresult = flags.gasprice;
    }

    console.log(`Trying to read ${flags.file}`);
    const fileStream = fs.createReadStream(flags.file);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });


    let transactions: any = [];

    rl.on('line', async (line) => {
      let txdata = line.split(" ");
      if (txdata.length !== 3) {
        console.log(`Line ${line} has an error and could not been parsed.`);
      } else {
        transactions.push(txdata);
      }

    }).on('close', async () => {
      // Do what you need to do with lines here

      let generatedTxs: { title: string, txdata: Transaction }[] = transactions.map(async (data: [string, string, number | string]): Promise<{ title: string, txdata: Transaction }> => {
        const [pk, to, amount] = data;

        const wallet = await zilliqa.wallet.addByPrivateKey(pk);
        // Get Account balance
        const balance = await zilliqa.blockchain.getBalance(wallet);

        if (balance.result === undefined) {
          this.error(`Account ${wallet} balance is undefined.`);
        }

        const txdata: Transaction = zilliqa.transactions.new({
          version: base.nodeVersion,
          toAddr: to,
          amount: new BN(units.toQa(amount, units.Units.Zil)), // Sending an amount in Zil (1) and converting the amount to Qa
          gasPrice: new BN(gasresult), // Minimum gasPrice veries. Check the `GetMinimumGasPrice` on the blockchain
          gasLimit: Long.fromNumber(1),
        });

        return {
          title: `Send ${amount} from ${wallet} to ${to}`,
          txdata: txdata
        };
      });

      Promise.all(generatedTxs).then(values => {

        const tasks = new Listr(values.map(it => {
          return {
            title: it.title,
            task: async (_ctx: any, task: any) => {
              let txresult = await zilliqa.blockchain.createTransaction(it.txdata);
              task.title = task.title + ' status ' + txresult.status + ' hash: ' + txresult.id;
            }
          }
        }));

        tasks.run().then(results => {
          //console.log(results);
        }).catch(err => {
          console.error(err);
        });

      })
    });
  }
}


module.exports = TxBatchSendCommand;
