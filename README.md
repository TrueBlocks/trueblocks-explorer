# TrueBlocks Explorer

![Image Logo](https://avatars1.githubusercontent.com/u/19167586?s=200&v=4)

[![Website](https://img.shields.io/badge/Website-quickblocks.io-brightgreen.svg)](https://quickblocks.io/)
[![TrueBlocks](https://img.shields.io/badge/Trueblocks-explorer-blue.svg)](https://github.com/Great-Hill-Corporation/trueblocks-explorer)
[![React](https://img.shields.io/badge/React-node.js-purple.svg)](https://reactjs.org/)
[![Twitter](https://img.shields.io/twitter/follow/espadrine.svg?style=social&label=Twitter)](https://twitter.com/quickblocks?lang=es)

TrueBlocks lets you explore the Ethereum blockchain in a fully-local and therefore fully-private way. This repo provides a frontend (this repo) application for the backend, [https://github.com/TrueBlocks/trueblocks-core](TrueBlocks core).

## Prerequisites

Prior to proceeding, you must [install the TrueBlocks Core](http://docs.trueblocks.io).

## Installing

Assuming you have the TrueBlocks core properly installed and can successfully run the following command:

```[shell]
> chifra --version
```

Then, you need to serve the index on your local machine:

```shell
chifra serve
```

### Installing the TrueBlocks Account Explorer

From your development folder:

```[shell]
git clone git@github.com:TrueBlocks/trueblocks-explorer.git
cd trueblocks-explorer
cp .env.example .env
yarn
yarn develop
```

Now, the application should be running at `localhost:1234`:


<img src="./public/screen_shot.png" />

## NPM Scripts

- `compile | compile:ui | compile:electron` compile TypeScript into JavaScript, usually before packing new Electron bundle
- `develop | develop:ui | develop:electron` run development server for UI and opens the app in Electron.
- `test | test:e2e` run unit or E2E tests

## Requirements

- **Note:** In order for the TrueBlocks to work, you must have access to an Ethereum node with **--tracing** enabled. An excellent choice is Turbo-Geth (now called XXX). TrueBlocks defaults to using Parity at the RPC endpoint http://localhost:8545, but you may use any node supporting tracing and any endpoint (Infura, Quiknodes, for example). Performance will be _greatly reduced_ if you use a remote server. A good solution to this problem is to run a node on the [dAppNode](https://dappnode.io/) or [Ava.do](https://ava.do/) platforms and use [http://github.com/TrueBlocks/trueblocks-docker](the TrueBlocks docker image).

## Getting Data on the Command Line

Assuming TrueBlocks is installed correctly, and that you have a node endpoint, and that the tools are in your \$PATH, you should be able to run the following command at a command prompt:

```
> chifra blocks 100
```

and get valid data from your node:

```
{
  "data": [
    {
      "gasLimit": 5000,
      "gasUsed": 0,
      "hash": "0xdfe2e70d6c116a541101cecbb256d7402d62125f6ddc9b607d49edc989825c64",
      "blockNumber": 100,
      "parentHash": "0xdb10afd3efa45327eb284c83cc925bd9bd7966aea53067c1eebe0724d124ec1e",
      "miner": "0xbb7b8287f3f0a933474a79eae42cbca977791171",
      "difficulty": 17916437174,
      "price": 0,
      "finalized": true,
      "timestamp": 1438270443,
      "transactions": []
    }
  ]
}
```

If that works, try this command:

```
> chifra blocks 0-latest:10000
```

Which exports every 10,000th block in the chain from first to last. Or, try this command:

```
> chifra blocks --uniq_tx 4001001
```

Which shows every address that appears anywhere in block 4,001,001. There are literally hundreds of other options to `chifra` and the other tools. See the documentation.

## Getting Data from the API

The TrueBlocks Explorer uses an API to access data provided (that is ultimately provided by `chifra`). Assuming everything is installed correctly and you've started the API server, you should be able to get the same data from the API:

```
> curl "http://localhost:8080/blocks?blocks=4001001&uniq_tx"
```

which returns the same as the preceding `chifra blocks --uniq_tx` command.

### Change data formats.

By default, everything from the API is returned as JSON.

However, you can change this by adding the options `&fmt=txt` or `&fmt=csv` to your request.

### Get docs

For documentation on the API, you may do this:

```
> open "http://localhost:8090"
```

## Scraping the Chain

To begin the process of creating the address index, enter this command in a seperate window or `tmux` session. You will need to keep this process running continually to keep the index fresh.

```
> chifra scrape
```

- **Note:** This requires a _--tracing node_ to produce a full list of appearances. It will work (with some configuration changes) on non-tracing nodes, but many of the appearances will not be included. Note also, this takes a loooong time. Depending on your setup at least 2-3 days (local node endpoint) or significantly longer (remote, rate-limited RPC endpoints).

## Examples:

There are many, many options to use TrueBlocks. Here are a few:

- Get a list of every **appearance** anywhere on the chain for a specific address:

  - `curl http://localhost/list?address=0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359`

- Get full details of every **transaction** for specific address to CSV:

  - `curl http://localhost/export?address=0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359&fmt=csv`

- Using the command line, get tab-seperated list of every **log** that an address appears in:

  - `> chifra export --logs 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359 --fmt txt`

- Get JSON details of every **trace** in which a specific address appears:

  - `curl http://localhost/export?trace&address=0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359`

- Get the name of an address:

  - `chifra names 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359` // Ethereum Tip Jar
  - `chifra names 0x6b175474e89094c44da98b954eedeac495271d0f` // DAI
  - `curl http://localhost/names?0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359` // TrueBlocks Tip Jar

- From the command line, get tab-seperated text of every **balance change in US dollars** for an addresses:

  - `> chifra export --balances --deltas 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359 --dollars`

- Get balance of DAI for an address at current block on command line:

  - `chifra tokens 0x6b175474e89094c44da98b954eedeac495271d0f (ethNames -ca true)`

There are literally hundreds of other options. Also, you may specify as many addresses as you wish on each command.

## FAQ

### I'm running geth, do I need to run Parity instead?

Yes - Parity delivers the necessary articulated traces so that TrueBlocks can build its address index. We don't yet support Geth.

### More coming soon...

## Troubleshooting

### More coming soon...

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Thomas Jay Rush** - [tjayrush](https://github.com/tjayrush)
- **Ed Mazurek** - [wildmolasses](https://github.com/wildmolasses)

See also the list of [contributors](https://github.com/Great-Hill-Corporation/trueblocks-docker/contributors) who participated in this project.

## License

Licensing information pending...

## References
