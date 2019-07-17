import { Command } from "@oclif/command";

import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';


class BlockchainInfoCommand extends Command {
  static description = `Retrieves generally blockchain information
...
such as the number of nodes per shard.
`;

  async run() {
    const base = new Zilcli.Base(this.config.home);
    const zilliqa = new Zilliqa(base.apiAddress);

    try {
      const info = await zilliqa.blockchain.1QA`  `;

      console.log(info);
    } catch (error) {
      console.error(error);
    }

  }
}

export = BlockchainInfoCommand;
