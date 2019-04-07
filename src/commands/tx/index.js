const {Command, flags} = require('@oclif/command');

class TransCommand extends Command {
  async run() {}
}

TransCommand.description = `Transactions Facade
...
Extra documentation goes here
`;

module.exports = TransCommand;
