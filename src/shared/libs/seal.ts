import {box} from 'tweetnacl';
import {blake2bInit, blake2bUpdate, blake2bFinal} from "blakejs";

const overheadLength = box.publicKeyLength + box.overheadLength;

function generateNonce(pk1: any, pk2: Uint8Array) {
  const state = blake2bInit(box.nonceLength, undefined);
  blake2bUpdate(state, pk1);
  blake2bUpdate(state, pk2);
  return blake2bFinal(state);
}

function zero(buf: Uint8Array) {
  for (let i = 0; i < buf.length; i++) {
    buf[i] = 0;
  }
}

export function sealBoxOpen(cipherText: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array) {
  const epk = cipherText.subarray(0, box.publicKeyLength);
  const nonce = generateNonce(epk, publicKey);

  const boxData = cipherText.subarray(box.publicKeyLength);
  return box.open(boxData, nonce, epk, secretKey);
}

export function sealBox(message: Uint8Array, publicKey: Uint8Array) {
  const c = new Uint8Array(overheadLength + message.length);

  const ek = box.keyPair();
  c.set(ek.publicKey);

  const nonce = generateNonce(ek.publicKey, publicKey);
  const boxed = box(message, nonce, publicKey, ek.secretKey);
  c.set(boxed, ek.publicKey.length);

  zero(ek.secretKey);

  return c;
}
