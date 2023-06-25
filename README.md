

# Installation

## Install Nodejs
[https://nodejs.org/dist/v16.15.1/node-v16.15.1-x64.msi](Download nodejs for windows)

## Install contracts dependencies
```
	npm i
```

## Install client

```
	cd ./client
	npm i
```

## Download and setup a local blockchain with Ganache

[https://trufflesuite.com/ganache/](Download Ganache)

# Testing

## Run contracts unit tests

install truffle `npm i -g truffle`

run `truffle test` or `npx truffle test` on windows


# Run the client with contracts

## Deploy the contracts
```
	truffle deploy
```
## Configurate the client with the contracts

Go to `./client/src/config.ts`
And modify the contracts address with the one you get when you've deployed them on any testnet.
## Starting a dev server
```
	cd ./client
	npm start
```
