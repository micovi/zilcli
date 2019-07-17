import { Command } from "@oclif/command";
import * as Zilcli from "../../base";
import { Zilliqa } from '@zilliqa-js/zilliqa';
import { Namicorn } from 'namicorn';

class DomainsResolveCommand extends Command {
  static description = `Returns the details of a specified domain name.
...

`;

  static args = [
    {
      name: 'domain',
      description: 'Domain name eg: zilcli.zil',
    }
  ]

  async run() {
    const { args } = this.parse(DomainsResolveCommand);

    try {
      const namicorn = new Namicorn();

      if (namicorn.isValidDomain(args.domain)) {
        const resolved = await namicorn.resolve(args.domain);

        console.log(resolved);
      } else {
        console.error('Invalid domain name');
      }

    } catch (error) {
      console.error(error);
    }

  }
}

export = DomainsResolveCommand;
