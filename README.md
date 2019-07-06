zilcli
======

Command Line Interface for Zilliqa Blockchain

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/zilcli.svg)](https://npmjs.org/package/zilcli)
[![CircleCI](https://circleci.com/gh/micovi/zilcli/tree/master.svg?style=shield)](https://circleci.com/gh/micovi/zilcli/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/zilcli.svg)](https://npmjs.org/package/zilcli)
[![License](https://img.shields.io/npm/l/zilcli.svg)](https://github.com/micovi/zilcli/blob/master/package.json)

<!-- toc -->
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
zilcli/2.0.0 darwin-x64 node-v10.16.0
$ zilcli --help [COMMAND]
USAGE
  $ zilcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zilcli contacts:add [ADDRESS] [NAME]`](#zilcli-contactsadd-address-name)
* [`zilcli contacts:list`](#zilcli-contactslist)
* [`zilcli contacts:remove [NAME]`](#zilcli-contactsremove-name)
* [`zilcli help [COMMAND]`](#zilcli-help-command)
* [`zilcli tx:send`](#zilcli-txsend)
* [`zilcli update [CHANNEL]`](#zilcli-update-channel)
* [`zilcli wallet:create`](#zilcli-walletcreate)
* [`zilcli wallet:details [NAME]`](#zilcli-walletdetails-name)
* [`zilcli wallet:export [NAME]`](#zilcli-walletexport-name)
* [`zilcli wallet:import [NAME] [PRIVATEKEY]`](#zilcli-walletimport-name-privatekey)
* [`zilcli wallet:list`](#zilcli-walletlist)
* [`zilcli wallet:remove [NAME]`](#zilcli-walletremove-name)

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

_See code: [src/commands/contacts/add.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/contacts/add.ts)_

## `zilcli contacts:list`

Lists all contacts from Address Book

```
USAGE
  $ zilcli contacts:list

DESCRIPTION
  Prints a table with all the saved accounts.
  Name, Address, Old Address format
```

_See code: [src/commands/contacts/list.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/contacts/list.ts)_

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

_See code: [src/commands/contacts/remove.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/contacts/remove.ts)_

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

_See code: [src/commands/tx/send.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/tx/send.ts)_

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

_See code: [src/commands/wallet/create.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/wallet/create.ts)_

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

_See code: [src/commands/wallet/details.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/wallet/details.ts)_

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

_See code: [src/commands/wallet/export.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/wallet/export.ts)_

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

_See code: [src/commands/wallet/import.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/wallet/import.ts)_

## `zilcli wallet:list`

Lists all configured Zilliqa Wallets

```
USAGE
  $ zilcli wallet:list

DESCRIPTION
  Prints a table with all the configured Wallet Accounts.
  ID, Name, Address, Balance
```

_See code: [src/commands/wallet/list.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/wallet/list.ts)_

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

_See code: [src/commands/wallet/remove.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/wallet/remove.ts)_
<!-- commandsstop -->
