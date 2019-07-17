import { Command } from "@oclif/command";

import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';


class BlockchainTxblocksCommand extends Command {
  static description = `Retrieves a TxBlock data.
...
By passing no argument it will retrieve the latest tx block.
`;

  static args = [
    {
      name: 'block_number',
      description: 'Block number',
    }
  ]

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    const { args } = this.parse(BlockchainTxblocksCommand);

    if (args.block_number) {
      try {
        const info = await zilliqa.blockchain.getTxBlock(args.block_number);

        console.log(info);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const info = await zilliqa.blockchain.getLatestTxBlock();

        console.log(info);
      } catch (error) {
        console.error(error);
      }
    }


  }
}

export = BlockchainTxblocksCommand;
