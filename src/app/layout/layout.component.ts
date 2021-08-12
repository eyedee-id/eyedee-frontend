import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {

  constructor() {

    //
    // const aldo = box.keyPair();
    //
    // console.log('public key:', encodeBase64(aldo.publicKey));
    // console.log('secretKey key:', encodeBase64(aldo.secretKey));
    //
    // const aesMessage = {
    //   secret_key: encodeBase64(aldo.secretKey),
    // };
    // const password = '12345678';
    // const aesEncrypted = aesEncryptData(aesMessage, password);
    // const aesDecrypted = aesDecryptData(aesEncrypted, password);
    //
    // console.log(aesEncrypted, aesDecrypted);
    // const secretKey = decodeBase64(aesDecrypted['secret_key']);
    //
    // const messageToEncrypt = 'ini pesan yang akan di enkripsi';
    // const nonce = randomBytes(box.nonceLength);
    // const encrypted = secretbox(decodeUTF8(messageToEncrypt), nonce, secretKey);
    // const messageEncrypted = encodeBase64(encrypted);
    // console.log(encrypted, messageEncrypted);
    // const decrypted = secretbox.open(encrypted, nonce, secretKey);
    // if (decrypted) {
    //   const messageDecrypted = encodeUTF8(decrypted);
    //   console.log(messageDecrypted);
    // }


    // // komunikasi enkripsi
    // //generating the key pairs
    // const david = box.keyPair();
    // const viktoria = box.keyPair();
    //
    // //Davids message
    // const plain_text = "Hey!!, our communication is now much secure";
    // let ciphertext = this.davidEncrypting(viktoria.publicKey, david.secretKey, plain_text);
    // console.log(this.viktoriaDecrypting(david.publicKey, viktoria.secretKey, ciphertext));
  }

  // davidEncrypting(victoriaPublicKey: Uint8Array, davidSecretKey: Uint8Array, plain_text: string) {
  //   //David computes a one time shared key
  //   const david_shared_key = box.before(victoriaPublicKey, davidSecretKey);
  //
  //   //David also computes a one time code.
  //   const one_time_code = randomBytes(box.nonceLength);
  //
  //
  //   //Getting the cipher text
  //   const cipher_text = box.after(
  //     decodeUTF8(plain_text),
  //     one_time_code,
  //     david_shared_key
  //   );
  //
  //   //message to be transited.
  //   return {cipher_text, one_time_code};
  // };
  //
  // viktoriaDecrypting(davidPublicKey: Uint8Array, victoriaSecretKey: Uint8Array, message: { cipher_text: Uint8Array, one_time_code: Uint8Array }) {
  //   //Getting Viktoria's shared key
  //   const viktoria_shared_key = box.before(davidPublicKey, victoriaSecretKey);
  //
  //   //Get the decoded message
  //   let decoded_message = box.open.after(message.cipher_text, message.one_time_code, viktoria_shared_key);
  //
  //   if (!decoded_message) {
  //     return null;
  //   }
  //
  //   //Get the human readable message
  //   let plain_text = encodeUTF8(decoded_message)
  //
  //   //return the message
  //   return plain_text;
  // };


}
