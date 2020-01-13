zilcli
======

Command Line Interface for Zilliqa Blockchain

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/zilcli.svg)](https://npmjs.org/package/zilcli)
[![Downloads/week](https://img.shields.io/npm/dw/zilcli.svg)](https://npmjs.org/package/zilcli)
[![License](https://img.shields.io/npm/l/zilcli.svg)](https://github.com/micovi/zilcli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Releases](https://github.com/micovi/zilcli/releases)
<!-- tocstop -->

# Installation instructions
If you have nodejs > v8.4.0 installed on your system you can install the CLI globally using

```sh-session
$ npm install -g zilcli
```

Or you can install the binary packaged versions for multiple Operating Systems

### Download Auto-Installers

Check [Releases page](https://github.com/micovi/zilcli/releases) for multiple versions

# Usage examples

## How to create a new wallet?
Make sure you have zilcli installed globally. Please check [Installation instructions](#installation-instructions) first.

The simplest way to create a new wallet is by using the command: ```zilcli wallet:create``` with no flags or arguments and follow along the instructions on the screen:

1. Execute wallet:create command with no arguments

```bash
$ zilcli wallet:create
```

2. Enter your desired account name (eg: default-account)

```bash
Enter account name: default-account
```

3. Select the network where you want it to be created, mainnet or testnet

```bash
Select network: mainnet
```

4. Enter passphrase that will be used to access the wallet (Remember to note your passphrase and store it in a safe place)

```bash
Enter passphrase: *******
```

5. If creation is successfull you will se a success message

```bash
Wallet successfully generate with address: 4af0fa5e5790562e5937876af0bc89f3efa826ef.
Trying to encrypt wallet with provided passphrase and scrypt method...
Successfully encrypted, now saving to wallet manager.
Account default-account successfully imported.
```


6. Next you can check your availalble wallets using wallet:list command

```bash
$ zilcli wallet:list

Name            Address                                  Network 
default-account 4af0fa5e5790562e5937876af0bc89f3efa826ef mainnet 
```

For more advanced usage check [`zilcli wallet:create`](#zilcli-walletcreate-name) command

## How to import a wallet?

Importing an existing wallet is as easy as creating a new one. You can import a wallet by it's private key using the interactive ```zilcli wallet:import``` command:

1. Start the interactive import tool using zilcli wallet:import

```bash
$ zilcli wallet:import
```

2. Enter your desired account name (eg: default-account)

```bash
Enter account name: default-account
```

3. Select the network where you want it to be created, mainnet or testnet

```bash
Select network: mainnet
```

4. Enter your private key you wish to import

```bash
Enter Private Key: *******
```

5. Enter passphrase that will be used to access the wallet (Remember to note your passphrase and store it in a safe place)

```bash
Enter passphrase ******
```

6. If creation is successfull you will se a success message

```bash
Trying to import wallet...
Successfully encrypted, now saving to wallet manager.
Account default successfully imported.
```

7. Next you can check your availalble wallets using wallet:list command

```bash
$ zilcli wallet:list

Name            Address                                  Network 
default-account 4af0fa5e5790562e5937876af0bc89f3efa826ef mainnet 
```

For more advanced usage check [`zilcli wallet:import`]((#zilcli-walletimport-name-privatekey)) command

## How to send a transaction?

You can send a transaction using the interactive UI zilcli provides:

1. Execute tx:send command with no arguments

```bash
$ zilcli tx:send
```

2. Select the account you want to use for the transaction

```bash
Select account used default-account
```

3. Enter your passphrase used to decode the account data and sign the transaction.

```bash
Enter passphrase ****
Selected network mainnet
```

4. Enter the destination address (where you want to send the ZIL tokens)

```bash
Enter destination address F69Feaa38828d7F8Cf1e82F28e42Bc465E3f082a
```

5. Enter amount you wish to transfer, **in ZIL**

```bash
Enter amount (in ZIL) 0.2
```

6. Confirm your transaction by typing yes or no.

```bash
Confirm that you wish to send 0.2 ZIL to F69Feaa38828d7F8Cf1e82F28e42Bc465E3f082a: Yes
Mininum gas price on the network 1000 Li
```

7. Enter gas amount, **in Li**

```bash
Enter gas amount (in Li) 1000
```

8. You will have to wait for the transaction to complete (usually takes ~2 min)

```bash
Generating and sending transaction... 
Transaction successfully sent
https://viewblock.io/zilliqa/tx/d9ec701c67f03877ae4069025960d6fc6221f72b7ad6b07e756b9e75252ae22e
{ cumulative_gas: 1, epoch_num: '66629', success: true }
```

For more advanced usage check [`zilcli tx:send`](#zilcli-txsend) command


## How to send a batch transaction? (**2.0**)
Sending a batch transaction can be done very easily using the interactive ```zilcli tx:batch``` command:

1. Start the interactive batch transfer command using ```--file``` flag:

```bash
$ zilcli tx:batch --file=/Users/TestUser/Documents/transactions.txt

```

*Note: You can also set the gas price using the ```--gasprice``` flag:

```bash
$ zilcli tx:batch --file=${PWD}/batch1.txt --gasprice=3000000000 
# Gas Price must be set in Qa
# ${PWD} returns the current path opened in terminal
```

**File example:** [batch.txt](https://zilcli.app/batch.txt)

2. You will have to wait for the transaction to complete:

```bash
Trying to read /Users/TEst/Documents/batch1.txt
  ⠙ Send 0.5 from zil1lvh0yv2qw5telvrel8x6e842dur6a08m504wgc to zil14wfm4rtx6yj0l5406n5sv8q2vlqky0ytv2kzwv
    Send 0.5 from zil14wfm4rtx6yj0l5406n5sv8q2vlqky0ytv2kzwv to zil14wfm4rtx6yj0l5406n5sv8q2vlqky0ytv2kzwv
```

For more advanced usage check [`zilcli tx:batch`](#zilcli-txbatch) command

## How to check your Ledger Balance? (**2.0**)
  1. You can check your default Ledger Account balance using ```zilcli ledger:account``` command:

  **Note:** Make sure you have your Ledger connected, unlocked and with Zilliqa App open.

  ```bash
  $ zilcli ledger:account
  ```

  2. Confirm the Address Check Action on Ledger:
  ```bash
    Please confirm action on Ledger.
    Account address is zil1tdn3m670vcs6wc77nqs5zguvmvthk0y6z6rccf
    Account balance 0.698 ZIL
  ```

## How to send a tx with Ledger? (**2.0**)
  1. You can send and sign a transaction using Ledger using ```zilcli ledger:send``` command:

  **Note:** Make sure you have your Ledger connected, unlocked and with Zilliqa App open.

  ```bash
  $ zilcli ledger:send
  ```

  2. Confirm the Private Key read on Ledger Device:

  ```bash
  Please confirm action on Ledger.
  Account address is zil1tdn3m670vcs6wc77nqs5zguvmvthk0y6z6rccf
  Account public key is 0363bbad88138c8fbe1613f85903f472b7b236d341a6141629113ba97fc1958130
  Account balance 0.698 ZIL
  ```

  3. Enter destination address, contact name or .ZIL domain
  ```bash
  ? Enter destination address or contact name zil1uncj8cf3dft6ss8m4356c7gjyq57lwxpqhwzld
  ```

  4. Enter the amount you wish to transfer (Note that must be completed in **ZIL**)
  ```bash
  ? Enter amount (in ZIL) 0.65
  ```

  5. Confirm the action on the terminal and Choose Gas Amount you want to use:

  ```bash
  ? Confirm that you wish to send 0.65 ZIL to zil1uncj8cf3dft6ss8m4356c7gjyq57lwxpqhwzld: Yes
  ```

  ```bash
  Mininum gas price on the network 1000 Li
  ? Enter gas amount (in Li) 1000
  ```

  6. Verify the TX DATA on Ledger Device and confirm it by pressing both keys.

  ```bash
  Please verify tx data on Ledger and confirm it.
  ```

  ```bash
  Generating and sending transaction... Transaction successfully sent
  { id: '1',
    jsonrpc: '2.0',
    result:
    { Info: 'Non-contract txn, sent to shard',
      TranID:
        'b290c19c050a74450e41e04e602f6a8c6439a662c0034bf787eacc851742a1d0' } }
  ```


  **ADVANCED USAGE**
  You can send a transaction using non-interactive command:

  ```bash
  zilcli ledger:send --to=zil1uncj8cf3dft6ss8m4356c7gjyq57lwxpqhwzld --amount=0.5 --gas=1000
  
  # Gas must be defined in LI
  ```

## How to verify a .ZIL Domain? (**2.0**)
  You can verify [Unstoppable Domains](https://unstoppabledomains.com) Addresses by using the ```zilcli domains:resolve``` command:

  ```bash
  zilcli domains:resolve zilcli.zil
  { addresses: {}, meta: { owner: null, ttl: 0 } }
  ```

  The Unstoppable Domains service is not fully Launched. Upon launch we will be implementing future API methods such as register, bid, manage.

## How to use the Local Address Book? (**2.0**)
  The Local Address Book is basically a Contacts List that you can fully manage. You can define custom names for different zil addresses and use those names when making transactions so it's easier for your readability.


  List all contacts
  ```bash
  zilcli contacts:list

  Name      Address                                    Old address                                
  teste     zil1ut6c039fmmeuxy50m5dwl9dwhrkyhv6lmrzyn9 0xE2f587c4A9DeF3c3128fDD1AEF95Aeb8Ec4bB35F
  ```


  Add a new contact
  ```bash
  zilcli contacts:add zil1ut6c039fmmeuxy50m5dwl9dwhrkyhv6lmrzyn9 test

  Contact test successfully saved.
  ```

  Remove an existing contact
  ```bash
  zilcli contacts:remove test

   Contact test successfully removed.
  ```

## How to sign a transaction? (**2.0.1**)
  You can use the zilcli tool offline to only sign a transaction that you defined using a init.json file.

  `tx:sign` requires 2 arguments: `init.json` path and `output.json` path. `contract.scilla` is only required if you try to sign a contract deploy transaction.

  Sign a contract transaction from the current directory. `init.json` contains tx init data and `contract.scilla` is the contract definition.

  `output.json` is the file where the transaction will be written along with it's signature.

  ```bash
  zilcli tx:sign ${PWD}/test.json ${PWD}/output.json ${PWD}/contract.scilla

Signature:  b11629f14165d46772d420c3bef90ff5e52f7d204af920afb6f1b568381f6427323243d074658a6282ea7af25f9dd01a00ae9eacfdf5cf5001ca836b1b8a27ce
Transaction successfully generated in:  /Users/test/zilcli-test/output.json
  ```

  Here is an example of `init.json` file: https://github.com/micovi/zilcli/blob/master/init.json

### `tx:sign INIT OUTPUT [CONTRACT]`

Sign a transaction

```
USAGE
  $ zilcli tx:sign INIT OUTPUT [CONTRACT]

ARGUMENTS
  INIT      Absolute file path for init.json
  OUTPUT    Absolute file path for output.json
  CONTRACT  Absolute file path for contract.scilla

OPTIONS
  -f, --from=from      account name or privateKey
  -p, --usePrivateKey  Private Key
```

## How to sign a transaction using Ledger? (**2.0.1**)
  You can use the zilcli tool offline to only sign a transaction that you defined using a init.json file.

  `ledger:sign` requires 2 arguments: `init.json` path and `output.json` path. `contract.scilla` is only required if you try to sign a contract deploy transaction.

  Sign a contract transaction from the current directory. `init.json` contains tx init data and `contract.scilla` is the contract definition.

  `output.json` is the file where the transaction will be written along with it's signature.

  Here is an example of `init.json` file: https://github.com/micovi/zilcli/blob/master/init.json

  ```bash
  zilcli ledger:sign ${PWD}/test.json ${PWD}/output.json ${PWD}/contract.scilla

Signature:  b11629f14165d46772d420c3bef90ff5e52f7d204af920afb6f1b568381f6427323243d074658a6282ea7af25f9dd01a00ae9eacfdf5cf5001ca836b1b8a27ce
Transaction successfully generated in:  /Users/test/zilcli-test/output.json
  ```
  
For more advanced commands you can the below the full list: 

# Commands list
<!-- commands -->
* [`zilcli blockchain:balance [ADDRESS]`](#zilcli-blockchainbalance-address)
* [`zilcli blockchain:info`](#zilcli-blockchaininfo)
* [`zilcli blockchain:txblock [BLOCK_NUMBER]`](#zilcli-blockchaintxblock-block_number)
* [`zilcli contacts:add [ADDRESS] [NAME]`](#zilcli-contactsadd-address-name)
* [`zilcli contacts:list`](#zilcli-contactslist)
* [`zilcli contacts:remove [NAME]`](#zilcli-contactsremove-name)
* [`zilcli domains:resolve [DOMAIN]`](#zilcli-domainsresolve-domain)
* [`zilcli help [COMMAND]`](#zilcli-help-command)
* [`zilcli ledger:account`](#zilcli-ledgeraccount)
* [`zilcli ledger:send`](#zilcli-ledgersend)
* [`zilcli plugins`](#zilcli-plugins)
* [`zilcli plugins:install PLUGIN...`](#zilcli-pluginsinstall-plugin)
* [`zilcli plugins:link PLUGIN`](#zilcli-pluginslink-plugin)
* [`zilcli plugins:uninstall PLUGIN...`](#zilcli-pluginsuninstall-plugin)
* [`zilcli plugins:update`](#zilcli-pluginsupdate)
* [`zilcli tx:batch`](#zilcli-txbatch)
* [`zilcli tx:details [HASH]`](#zilcli-txdetails-hash)
* [`zilcli tx:recent [LIMIT]`](#zilcli-txrecent-limit)
* [`zilcli tx:send`](#zilcli-txsend)
* [`zilcli update [CHANNEL]`](#zilcli-update-channel)
* [`zilcli wallet:create`](#zilcli-walletcreate)
* [`zilcli wallet:details [NAME]`](#zilcli-walletdetails-name)
* [`zilcli wallet:export [NAME]`](#zilcli-walletexport-name)
* [`zilcli wallet:import [NAME] [PRIVATEKEY]`](#zilcli-walletimport-name-privatekey)
* [`zilcli wallet:list`](#zilcli-walletlist)
* [`zilcli wallet:remove [NAME]`](#zilcli-walletremove-name)

## `zilcli blockchain:balance [ADDRESS]`

Returns balance for an address or from a batch of addreses.

```
USAGE
  $ zilcli blockchain:balance [ADDRESS]

ARGUMENTS
  ADDRESS  Address you want to get the balance for (could be domain name or contact name)

OPTIONS
  --batch=batch

DESCRIPTION
  ...
     Use batch flag to check balance for multiple addresses. You have to enter the full path to file (eg zilcli 
  blockchain:balance --batch=/home/user/addresses.txt)
      $ zilcli blockchain:balance --batch=/home/user/addresses.txt
```

_See code: [src/commands/blockchain/balance.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/blockchain/balance.ts)_

## `zilcli blockchain:info`

Retrieves generally blockchain information

```
USAGE
  $ zilcli blockchain:info

DESCRIPTION
  ...
  such as the number of nodes per shard.
```

_See code: [src/commands/blockchain/info.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/blockchain/info.ts)_

## `zilcli blockchain:txblock [BLOCK_NUMBER]`

Retrieves a TxBlock data.

```
USAGE
  $ zilcli blockchain:txblock [BLOCK_NUMBER]

ARGUMENTS
  BLOCK_NUMBER  Block number

DESCRIPTION
  ...
  By passing no argument it will retrieve the latest tx block.
```

_See code: [src/commands/blockchain/txblock.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/blockchain/txblock.ts)_

## `zilcli contacts:add [ADDRESS] [NAME]`

Describe the command here

```
USAGE
  $ zilcli contacts:add [ADDRESS] [NAME]

ARGUMENTS
  ADDRESS  Contact address
  NAME     Contact name

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/contacts/add.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/contacts/add.ts)_

## `zilcli contacts:list`

Lists all contacts from Address Book

```
USAGE
  $ zilcli contacts:list

DESCRIPTION
  Prints a table with all the saved accounts.
  Name, Address, Old Address format
```

_See code: [src/commands/contacts/list.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/contacts/list.ts)_

## `zilcli contacts:remove [NAME]`

Remove existing Contact from Address Book

```
USAGE
  $ zilcli contacts:remove [NAME]

ARGUMENTS
  NAME  contact name you want to remove

DESCRIPTION
  ...
```

_See code: [src/commands/contacts/remove.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/contacts/remove.ts)_

## `zilcli domains:resolve [DOMAIN]`

Returns the details of a specified domain name.

```
USAGE
  $ zilcli domains:resolve [DOMAIN]

ARGUMENTS
  DOMAIN  Domain name eg: zilcli.zil

DESCRIPTION
  ...
```

_See code: [src/commands/domains/resolve.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/domains/resolve.ts)_

## `zilcli help [COMMAND]`

display help for zilcli

```
USAGE
  $ zilcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `zilcli ledger:account`

Displays details of Ledger Account

```
USAGE
  $ zilcli ledger:account
```

_See code: [src/commands/ledger/account.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/ledger/account.ts)_

## `zilcli ledger:send`

Create and send a transaction using the Ledger Device

```
USAGE
  $ zilcli ledger:send

OPTIONS
  -a, --amount=amount  amount in ZIL
  -g, --gas=gas        gas to use (defined in Li)
  -t, --to=to          destination address

DESCRIPTION
```

_See code: [src/commands/ledger/send.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/ledger/send.ts)_

## `zilcli plugins`

list installed plugins

```
USAGE
  $ zilcli plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ zilcli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/index.ts)_

## `zilcli plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ zilcli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ zilcli plugins:add

EXAMPLES
  $ zilcli plugins:install myplugin 
  $ zilcli plugins:install https://github.com/someuser/someplugin
  $ zilcli plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/install.ts)_

## `zilcli plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ zilcli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ zilcli plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/link.ts)_

## `zilcli plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ zilcli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ zilcli plugins:unlink
  $ zilcli plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/uninstall.ts)_

## `zilcli plugins:update`

update installed plugins

```
USAGE
  $ zilcli plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/update.ts)_

## `zilcli tx:batch`

Create and send batch transactions

```
USAGE
  $ zilcli tx:batch

OPTIONS
  -f, --file=file      (required) transactions file path
  -t, --to=to          (required) destination address
  --gasprice=gasprice  gas price (in Qa)

DESCRIPTION
  Batch file format should contain private key, destination and amount used to send.

  File format example:
  privatekey destination 10
  privatekey destination all
  privatekey destination 0.5
```

_See code: [src/commands/tx/batch.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/tx/batch.ts)_

## `zilcli tx:details [HASH]`

Returns the details of a specified Transaction.

```
USAGE
  $ zilcli tx:details [HASH]

ARGUMENTS
  HASH  Transaction hash you want to get details for

DESCRIPTION
  ...
```

_See code: [src/commands/tx/details.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/tx/details.ts)_

## `zilcli tx:recent [LIMIT]`

Retrieve a list with recent 100 transactions

```
USAGE
  $ zilcli tx:recent [LIMIT]

ARGUMENTS
  LIMIT  Limit

DESCRIPTION
  ...
```

_See code: [src/commands/tx/recent.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/tx/recent.ts)_

## `zilcli tx:send`

Create and send a transaction

```
USAGE
  $ zilcli tx:send

OPTIONS
  -a, --amount=amount  amount in ZIL
  -f, --from=from      account name or privateKey
  -g, --gas=gas        gas to use (defined in Li)
  -p, --usePrivateKey  Private Key
  -t, --to=to          destination address

DESCRIPTION
```

_See code: [src/commands/tx/send.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/tx/send.ts)_

## `zilcli update [CHANNEL]`

update the zilcli CLI

```
USAGE
  $ zilcli update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_

## `zilcli wallet:create`

```
USAGE
  $ zilcli wallet:create
```

_See code: [src/commands/wallet/create.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/wallet/create.ts)_

## `zilcli wallet:details [NAME]`

Prints out details about Wallet

```
USAGE
  $ zilcli wallet:details [NAME]

ARGUMENTS
  NAME  Wallet name to get details for

DESCRIPTION
  Returned data: Name, ID, Address, Balance privateKey, publicKey, Network details
```

_See code: [src/commands/wallet/details.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/wallet/details.ts)_

## `zilcli wallet:export [NAME]`

Export account to keystore file

```
USAGE
  $ zilcli wallet:export [NAME]

ARGUMENTS
  NAME  account name you want to export

DESCRIPTION
  Export wallet account to keystore file encoded with passphrase.
```

_See code: [src/commands/wallet/export.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/wallet/export.ts)_

## `zilcli wallet:import [NAME] [PRIVATEKEY]`

Import wallet

```
USAGE
  $ zilcli wallet:import [NAME] [PRIVATEKEY]

ARGUMENTS
  NAME        [default: default] Account name
  PRIVATEKEY  File path / Private Key / Mnemonic phrase

OPTIONS
  --type=keystore|privateKey  [default: privateKey] import type

DESCRIPTION
  You can import wallet accounts from keystore file or by Private Key
  Keystore file must be located in $HOME/.zilcli/ directory.
```

_See code: [src/commands/wallet/import.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/wallet/import.ts)_

## `zilcli wallet:list`

Lists all configured Zilliqa Wallets

```
USAGE
  $ zilcli wallet:list

DESCRIPTION
  Prints a table with all the configured Wallet Accounts.
  ID, Name, Address, Balance
```

_See code: [src/commands/wallet/list.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/wallet/list.ts)_

## `zilcli wallet:remove [NAME]`

Remove existing wallet from Zilcli Manager

```
USAGE
  $ zilcli wallet:remove [NAME]

ARGUMENTS
  NAME  account name you want to remove

DESCRIPTION
  ...
```

_See code: [src/commands/wallet/remove.ts](https://github.com/micovi/zilcli/blob/v2.0.0-beta/src/commands/wallet/remove.ts)_
<!-- commandsstop -->


## Feedback and contributing

We would love to hear some feedback from you, if you find any bugs or you have any feature requests you can open an Issue on github. For any questions you can find me on Zilliqa Telegram Channels under the nickname **micovi**

You can contribute by opening any PR on github.

Thank you! 🍻
