const {flags} = require('@oclif/command');
const ZilliqaBase = require('../../base').default;

const {cli} = require('cli-ux');
const inquirer = require('inquirer');
const chalk = require('chalk');

const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {BN, units, Long} = require('@zilliqa-js/util');

const {validateAddress, isNumeric} = require('../../utils/blockchain');

class TransSendCommand extends ZilliqaBase {
  async run() {
    const {flags} = this.parse(TransSendCommand);

    let {from, to, amount, gas, usePrivateKey} = flags;

    const networks = super.getNetworks();
    let node;
    let privateKey;
    let passphrase;
    let account;

    // Ask for private key if needed or set the account from accounts file
    if (usePrivateKey === true) {
      privateKey = (await inquirer.prompt([
        {
          name: 'value',
          message: 'Enter your Private Key',
          type: 'input',
          required: true,
          mask: true,
        },
      ])).value;

      node = networks[0];
    } else {
      const accounts = await super.getAccounts();

      from = (await inquirer.prompt([
        {
          name: 'value',
          message: 'Select account used',
          type: 'list',
          choices: accounts.map(item => {
            return {
              name: item.name,
              value: item,
            };
          }),
        },
      ])).value;

      passphrase = (await inquirer.prompt([
        {
          name: 'value',
          message: 'Enter passphrase',
          mask: true,
          type: 'password',
        },
      ])).value;

      node = from.network;
    }

    this.log(`Selected network ${chalk.bold(node.title)}`);

    // Initialize zilliqa and wallet
    const zilliqa = new Zilliqa(node.apiAddress);

    if (usePrivateKey === true) {
      account = await zilliqa.wallet.addByPrivateKey(privateKey);
    } else {
      account = await zilliqa.wallet.addByKeystore(JSON.stringify(from.data), passphrase);
    }

    if (to === undefined || validateAddress(to) === false) {
      to = (await inquirer.prompt([
        {
          name: 'value',
          message: 'Enter destination address',
          type: 'input',
          validate: validateAddress,
          required: true,
        },
      ])).value;
    }

    if (amount === undefined) {
      amount = parseFloat(
        (await inquirer.prompt([
          {
            name: 'value',
            message: 'Enter amount (in ZIL)',
            type: 'input',
            validate: isNumeric,
            required: true,
          },
        ])).value
      );
    }

    const confirmed = (await inquirer.prompt([
      {
        name: 'value',
        message: `Confirm that you wish to send ${chalk.bold.green(amount)} ZIL to ${chalk.bold.green(to)}:`,
        type: 'confirm',
      },
    ])).value;

    if (confirmed === false) {
      this.log('OK. Goodbye');
      this.exit(1);
    }

    try {
      // Get Account balance
      const balance = await zilliqa.blockchain.getBalance(account);

      if (balance.result === undefined) {
        this.error('Account balance is undefined');
      }

      // Calculate gas prices
      const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
      const liGasPrice = units.fromQa(new BN(minGasPrice.result), units.Units.Li);
      this.log(`Mininum gas price on the network ${liGasPrice} Li`);

      // Calculate needed amount
      if (gas === undefined) {
        gas = parseInt(
          (await inquirer.prompt([
            {
              name: 'value',
              message: 'Enter gas amount (in Li)',
              type: 'input',
              default: liGasPrice,
              validate: val => {
                if (isNumeric(val) === false) return 'Gas amount must be a number';
                /* if (units.toQa(val, units.Units.Li).gte(new BN(minGasPrice.result) === false))
                  return 'Gas amount should be bigger or equal to minimum gas price'; */

                return true;
              },
              required: true,
            },
          ])).value,
          10
        );
      }

      // Convert gas to Qa and check if is bigger than minimum gas price
      const myGasPrice = units.toQa(gas, units.Units.Li);

      cli.action.start('Generating and sending transaction');

      const sendTx = await zilliqa.blockchain.createTransaction(
        zilliqa.transactions.new({
          version: node.version,
          toAddr: to,
          amount: new BN(units.toQa(amount, units.Units.Zil)), // Sending an amount in Zil (1) and converting the amount to Qa
          gasPrice: myGasPrice, // Minimum gasPrice veries. Check the `GetMinimumGasPrice` on the blockchain
          gasLimit: Long.fromNumber(1),
        })
      );

      cli.action.stop('Transaction successfully sent');

      await cli.url('[Open Explorer] ', `https://viewblock.io/zilliqa/tx/${sendTx.id}`);

      this.log(sendTx.receipt);
    } catch (error) {
      this.error(error);
    }
  }
}

TransSendCommand.description = `Create and send a transaction

`;

TransSendCommand.flags = {
  from: flags.string({char: 'f', description: 'account name or privateKey'}),
  to: flags.string({char: 't', description: 'destination address'}),
  amount: flags.string({char: 'a', description: 'amount in ZIL'}),
  gas: flags.integer({char: 'g', description: 'gas to use (defined in Li)'}),
  usePrivateKey: flags.boolean({char: 'p', description: 'Private Key'}),
};

module.exports = TransSendCommand;
