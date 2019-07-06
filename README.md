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
* [`zilcli hello [FILE]`](#zilcli-hello-file)
* [`zilcli help [COMMAND]`](#zilcli-help-command)

## `zilcli hello [FILE]`

describe the command here

```
USAGE
  $ zilcli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ zilcli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/micovi/zilcli/blob/v2.0.0/src/commands/hello.ts)_

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
<!-- commandsstop -->
