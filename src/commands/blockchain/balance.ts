import Command, { flags } from "@oclif/command";
import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';
import fs from "fs";
import readline from "readline";

class BlockchainBalanceCommand extends Command {
  static description = `Returns balance for an address or from a batch of addreses.
...
  Use batch flag to check balance for multiple addresses. You have to enter the full path to file (eg zilcli blockchain:balance --batch=/home/user/addresses.txt)
   $ zilcli blockchain:balance --batch=/home/user/addresses.txt
`;

  static args = [
    {
      name: 'address',
      description: 'Address you want to get the balance for (could be domain name or contact name)',
    }
  ]

  static flags = {
    batch: flags.string()
  }

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const { args, flags } = this.parse(BlockchainBalanceCommand);

    if (flags.batch !== undefined) {

      console.log(`Trying to read ${flags.batch}`);
      const fileStream = fs.createReadStream(flags.batch);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      rl.on('line', async (line) => {
        const balance = await zilliqa.blockchain.getBalance(line);
        console.log(`${line}:`, balance.result);
      });
    }

    if (args.address !== undefined) {
      const address = await base.validateAddress(args.address);
      if (address === false) {
        console.error('Address seems to be invalid or account does not exist.');
      } else {
        const balance = await zilliqa.blockchain.getBalance(address);
        console.log(balance.result);
      }
    }

  }
}

export = BlockchainBalanceCommand;
