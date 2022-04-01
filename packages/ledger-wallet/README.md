# @near-wallet-selector/ledger

This is the [Ledger](https://www.ledger.com/) package for NEAR Wallet Selector.

## Installation and Usage

The easiest way to use this package is to install it from the NPM registry:

```bash
# Using Yarn
yarn add @near-wallet-selector/ledger

# Using NPM.
npm install @near-wallet-selector/ledger
```

Then use it in your dApp:

```ts
import NearWalletSelector from "@near-wallet-selector/core";
import { setupLedger } from "@near-wallet-selector/ledger";

// Ledger for Wallet Selector can be setup without any params or it can take one optional param.
const ledger = setupLedger({
  iconPath: "https://yourdomain.com/yourwallet-icon.png"
});

const selector = await NearWalletSelector.init({
  wallets: [ledger],
  network: "testnet",
  contractId: "guest-book.testnet",
});
```

## Options

- `iconPath`: (`string?`): Image URL for the icon shown in the modal. This can also be a relative path or base64 encoded image

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).