import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { BN, units, Long } from '@zilliqa-js/util';

const txnEncoder = require('@zilliqa-js/account/dist/util').encodeTransactionProto;

const ERROR_DESCRIPTION = {
  1: 'U2F: Unknown',
  2: 'U2F: Bad request',
  3: 'U2F: Configuration unsupported',
  4: 'U2F: Device Ineligible',
  5: 'U2F: Timeout',
  14: 'Timeout',
  0x9000: 'No errors',
  0x9001: 'Device is busy',
  0x6400: 'Execution Error',
  0x6700: 'Wrong Length',
  0x6982: 'Empty Buffer',
  0x6983: 'Output buffer too small',
  0x6984: 'Data is invalid',
  0x6985: 'Conditions not satisfied',
  0x6986: 'Transaction rejected',
  0x6A80: 'Bad key handle',
  0x6B00: 'Invalid P1/P2',
  0x6D00: 'Instruction not supported',
  0x6E00: 'Cosmos app does not seem to be open',
  0x6F00: 'Unknown error',
  0x6F01: 'Sign/verify error',
};

export default class Ledger {
  CLA = 0xe0;
  INS = {
    "getVersion": 0x01,
    "getPublickKey": 0x02,
    "getPublicAddress": 0x02,
    "signHash": 0x04,
    "signTxn": 0x08
  };

  PubKeyByteLen = 33;
  AddrByteLen = 20;
  SigByteLen = 64;
  HashByteLen = 32;
  // https://github.com/Zilliqa/Zilliqa/wiki/Address-Standard#specification
  Bech32AddrLen = "zil".length + 1 + 32 + 6;

  transport: any;

  constructor(transport: any, scrambleKey = "w0w") {
    this.transport = transport;
    transport.decorateAppAPIMethods(
      this,
      [
        "getVersion",
        "getPublicKey",
        "getPublicAddress",
        "signHash",
        "signTxn"
      ],
      scrambleKey
    );
  }

  async transportOpen() {
    return await TransportNodeHid.open("");
  }

  extractResultFromResponse(response: any) {
    // 72 is the signature length as defined in the low level nano s syscall
    return response.slice(0, 72).toString('hex');
  }

  async getAddress(index: number): Promise<string> {
    const P1 = 0x00;
    const P2 = 0x01;

    try {
      const transport = await this.transportOpen();

      let payload = Buffer.alloc(4);

      payload.writeInt32LE(index, 0);

      console.log('Please confirm operation on Ledger');

      const address = await transport
        .send(this.CLA, this.INS.getPublicAddress, P1, P2, payload, [0x9000])
        .then((response: any) => {
          // After the first PubKeyByteLen bytes, the remaining is the bech32 address string.
          const pubAddr = response.slice(this.PubKeyByteLen, this.PubKeyByteLen + this.Bech32AddrLen).toString("utf-8");
          return pubAddr;
        });

      return address;
    } catch (error) {
      /* if (error.message === 'NoDevice') {
        throw ('Please connect and unlock your Ledger Device');
      } */

      throw error.message;

      //throw ('Please make sure you have the Zilliqa App open on your Ledger Device');
    }
  }

  async signTxn(keyIndex: number, txnParams: any) {
    // https://github.com/Zilliqa/Zilliqa-JavaScript-Library/tree/dev/packages/zilliqa-js-account#interfaces
    const P1 = 0x00;
    const P2 = 0x00;

    let indexBytes = Buffer.alloc(4);
    indexBytes.writeInt32LE(keyIndex, 0);

    // Convert to Zilliqa types
    if (!(txnParams.amount instanceof BN)) {
      txnParams.amount = new BN(txnParams.amount);
    }

    if (!(txnParams.gasPrice instanceof BN)) {
      txnParams.gasPrice = new BN(txnParams.gasPrice);
    }

    if (!(txnParams.gasLimit instanceof Long)) {
      txnParams.gasLimit = Long.fromNumber(txnParams.gasLimit);
    }

    var txnBytes = txnEncoder(txnParams);
    const message = JSON.stringify({ "Encoded transaction": txnBytes.toString('hex') }, null, 2);
    console.log(message);

    const STREAM_LEN = 32; // Stream in batches of STREAM_LEN bytes each.
    var txn1Bytes;
    if (txnBytes.length > STREAM_LEN) {
      txn1Bytes = txnBytes.slice(0, STREAM_LEN);
      txnBytes = txnBytes.slice(STREAM_LEN, undefined);
    } else {
      txn1Bytes = txnBytes;
      txnBytes = Buffer.alloc(0);
    }

    var txn1SizeBytes = Buffer.alloc(4);
    txn1SizeBytes.writeInt32LE(txn1Bytes.length, 0);
    var hostBytesLeftBytes = Buffer.alloc(4);
    hostBytesLeftBytes.writeInt32LE(txnBytes.length, 0);
    // See signTxn.c:handleSignTxn() for sequence details of payload.
    // 1. 4 bytes for indexBytes.
    // 2. 4 bytes for hostBytesLeftBytes.
    // 3. 4 bytes for txn1SizeBytes (number of bytes being sent now).
    // 4. txn1Bytes of actual data.
    const payload = Buffer.concat([indexBytes, hostBytesLeftBytes, txn1SizeBytes, txn1Bytes]);

    if (this.transport !== null) {
      return this.transport
        .send(this.CLA, this.INS.signTxn, P1, P2, payload, [0x9000])
        .then(function cb(response: any): any {
          // Keep streaming data into the device till we run out of it.
          // See signTxn.c:istream_callback() for how this is used.
          // Each time the bytes sent consists of:
          //  1. 4-bytes of hostBytesLeftBytes.
          //  2. 4-bytes of txnNSizeBytes (number of bytes being sent now).
          //  3. txnNBytes of actual data.
          if (txnBytes.length > 0) {
            var txnNBytes;
            if (txnBytes.length > STREAM_LEN) {
              txnNBytes = txnBytes.slice(0, STREAM_LEN);
              txnBytes = txnBytes.slice(STREAM_LEN, undefined);
            } else {
              txnNBytes = txnBytes;
              txnBytes = Buffer.alloc(0);
            }

            var txnNSizeBytes = Buffer.alloc(4);
            txnNSizeBytes.writeInt32LE(txnNBytes.length, 0);
            hostBytesLeftBytes.writeInt32LE(txnBytes.length, 0);
            const payload = Buffer.concat([hostBytesLeftBytes, txnNSizeBytes, txnNBytes]);
            return this.transport.exchange(payload).then(cb);
          }
          return response;
        })
        .then(result => {
          return { sig: (result.toString('hex').slice(0, this.SigByteLen * 2)) };
        });
    }
  }


}
