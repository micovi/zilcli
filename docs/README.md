# zilcli
===========

CLI Wallet for Zilliqa blockchain.

[![Version](https://img.shields.io/npm/v/zilcli.svg)](https://npmjs.org/package/zilcli)
[![Downloads/week](https://img.shields.io/npm/dw/zilcli.svg)](https://npmjs.org/package/zilcli)
[![License](https://img.shields.io/npm/l/zilcli.svg)](https://github.com/micovi/zilcli/blob/master/package.json)


❗**NOTE**❗

You can use zilci wallets only with **native ZIL tokens**. ERC20 ZIL tokens are not supported, please DO NOT send ERC20 ZIL to zilcli wallets. First you have to swap them on a Exchange. 

Read more about [How to swap ERC20 ZIL tokens](#).

❗**NOTE**❗



# Installation instructions
If you have nodejs > v8.4.0 installed on your system you can install the CLI globally using

```sh-session
$ npm install -g zilcli
```

Or you can install the binary packaged versions for multiple Operating Systems

### Binary auto-installers

**Windows**

[Windows x64: zilcli-v1.0.1-x64.exe](https://github.com/micovi/zilcli/releases/download/v1.0.1/zilcli-v1.0.1-x64.exe)

[Windows x86: zilcli-v1.0.1-x86.exe](https://github.com/micovi/zilcli/releases/download/v1.0.1/zilcli-v1.0.1-x86.exe)

**MacOS**

[MacOS: zilcli-v1.0.1.pkg](https://github.com/micovi/zilcli/releases/download/v1.0.1/zilcli-v1.0.1.pkg)

**Linux**

Coming soon

Check [Releases page](https://github.com/micovi/zilcli/releases/tag/v1.0.1) for multiple versions

<!-- toc -->
* [zilcli](#zilcli)
* [Installation instructions](#installation-instructions)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g zilcli
$ zilcli COMMAND
running command...
$ zilcli (-v|--version|version)
zilcli/1.0.1 darwin-x64 node-v9.4.0
$ zilcli --help [COMMAND]
USAGE
  $ zilcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zilcli balance [HASH]`](#zilcli-balance-hash)
* [`zilcli help [COMMAND]`](#zilcli-help-command)
* [`zilcli tx`](#zilcli-tx)
* [`zilcli tx:send`](#zilcli-txsend)
* [`zilcli update [CHANNEL]`](#zilcli-update-channel)
* [`zilcli wallet`](#zilcli-wallet)
* [`zilcli wallet:create [NAME]`](#zilcli-walletcreate-name)
* [`zilcli wallet:details [NAME]`](#zilcli-walletdetails-name)
* [`zilcli wallet:export [NAME]`](#zilcli-walletexport-name)
* [`zilcli wallet:import [NAME] [PRIVATEKEY]`](#zilcli-walletimport-name-privatekey)
* [`zilcli wallet:list`](#zilcli-walletlist)
* [`zilcli wallet:remove [NAME]`](#zilcli-walletremove-name)

## `zilcli balance [HASH]`

Check balance by address or by Private Key

```
USAGE
  $ zilcli balance [HASH]

ARGUMENTS
  HASH  Address or Private Key value

OPTIONS
  -b, --by=privateKey|address  [default: address] Type of check: privateKey or address
  -c, --convert=convert        [default: zil] Convert to
  -t, --testnet                Use testnet

DESCRIPTION
  NOTE: --by flag is required. See examples below

EXAMPLES
  $ zilcli balance 23sdg235935dsg9325sd
  $ zilcli balance 23sdg235935dsg9325sd --by=privateKey
  $ zilcli balance 23sdg235935dsg9325sd --by=address --testnet
```

_See code: [src/commands/balance.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/balance.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `zilcli tx`

Transactions Facade

```
USAGE
  $ zilcli tx

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/tx/index.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/tx/index.js)_

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

_See code: [src/commands/tx/send.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/tx/send.js)_

## `zilcli update [CHANNEL]`

update the zilcli CLI

```
USAGE
  $ zilcli update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_

## `zilcli wallet`

Wallet Facade

```
USAGE
  $ zilcli wallet

OPTIONS
  --loglevel=error|warn|info|debug

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/wallet/index.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/wallet/index.js)_

## `zilcli wallet:create [NAME]`

Describe the command here

```
USAGE
  $ zilcli wallet:create [NAME]

ARGUMENTS
  NAME  Wallet name used across the CLI

OPTIONS
  --loglevel=error|warn|info|debug

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/wallet/create.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/wallet/create.js)_

## `zilcli wallet:details [NAME]`

Prints out details about Wallet

```
USAGE
  $ zilcli wallet:details [NAME]

ARGUMENTS
  NAME  Wallet name to get details for

OPTIONS
  --loglevel=error|warn|info|debug

DESCRIPTION
  Returned data: Name, ID, Address, Balance privateKey, publicKey, Network details
```

_See code: [src/commands/wallet/details.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/wallet/details.js)_

## `zilcli wallet:export [NAME]`

Export account to keystore file

```
USAGE
  $ zilcli wallet:export [NAME]

ARGUMENTS
  NAME  account name you want to export

OPTIONS
  --loglevel=error|warn|info|debug

DESCRIPTION
  Export wallet account to keystore file encoded with passphrase.
```

_See code: [src/commands/wallet/export.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/wallet/export.js)_

## `zilcli wallet:import [NAME] [PRIVATEKEY]`

Import wallet

```
USAGE
  $ zilcli wallet:import [NAME] [PRIVATEKEY]

ARGUMENTS
  NAME        [default: default] Account name
  PRIVATEKEY  File path / Private Key

OPTIONS
  --type=keystore|privateKey  [default: privateKey] import type

DESCRIPTION
  You can import wallet accounts from keystore file or by Private Key
  Keystore file must be located in $HOME/.zilcli/ directory.
```

_See code: [src/commands/wallet/import.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/wallet/import.js)_

## `zilcli wallet:list`

Lists all configured Zilliqa Wallets

```
USAGE
  $ zilcli wallet:list

OPTIONS
  --loglevel=error|warn|info|debug

DESCRIPTION
  Prints a table with all the configured Wallet Accounts.
  ID, Name, Address, Balance
```

_See code: [src/commands/wallet/list.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/wallet/list.js)_

## `zilcli wallet:remove [NAME]`

Remove an account from Local Wallet

```
USAGE
  $ zilcli wallet:remove [NAME]

ARGUMENTS
  NAME  account name you want to remove

OPTIONS
  --loglevel=error|warn|info|debug
```

_See code: [src/commands/wallet/remove.js](https://github.com/micovi/zilcli/blob/v1.0.1/src/commands/wallet/remove.js)_
<!-- commandsstop -->

## Feedback and contributing

We would love to hear some feedback from you, if you find any bugs or you have any feature requests you can open an Issue on github.

You can contribute by opening any PR on github.

## Support us

If you like and use our CLI tool, you can buy us a beer by donating ZIL to the following address:
```0xfb2ef2314075179fb079f9cdac9eaa6f07aebcfb```

Thank you! 🍻
