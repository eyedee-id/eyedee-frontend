import * as CryptoJS from "crypto-js";

export function aesEncryptData(data: any, key: string) {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function aesDecryptData(data: any, key: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, key);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
