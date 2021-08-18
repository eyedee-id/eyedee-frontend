import * as CryptoJS from "crypto-js";

export const SigV4Utils = {
  sign: (key: any, message: string) => {
    const hash = CryptoJS.HmacSHA256(message, key);
    return hash.toString(CryptoJS.enc.Hex);
  },
  sha256: (message: string) => {
    const hash2 = CryptoJS.SHA256(message);
    return hash2.toString(CryptoJS.enc.Hex);
  },
  getSignatureKey: (key: string, dateStamp: string, regionName: string, serviceName: string) => {
    const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    return CryptoJS.HmacSHA256('aws4_request', kService);
  }
}
