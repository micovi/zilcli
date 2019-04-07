const ZilliqaBase = require('../../base').default;

class WalletCommand extends ZilliqaBase {
  async run() {}
}

WalletCommand.description = `Wallet Facade
...
Extra documentation goes here
`;

WalletCommand.flags = {
  ...ZilliqaBase.flags,
};

module.exports = WalletCommand;
