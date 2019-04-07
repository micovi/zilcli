const ZilliqaBase = require('../../base').default;

class WalletRemoveCommand extends ZilliqaBase {
  async run() {
    const {args} = this.parse(WalletRemoveCommand);

    this.warning('Command is not functional.');
  }
}

WalletRemoveCommand.description = `Remove an account from Local Wallet
`;

WalletRemoveCommand.args = [
  {
    name: 'name',
    description: 'account name you want to remove',
  },
];

module.exports = WalletRemoveCommand;
