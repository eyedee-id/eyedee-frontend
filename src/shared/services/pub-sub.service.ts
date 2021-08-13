import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {Auth} from "@aws-amplify/auth";
import {Client} from 'paho-mqtt';
import * as CryptoJS from 'crypto-js';

import dayjs from "dayjs";
import {ConfideModel} from "../models/confide.model";

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)


@Injectable()
export class PubSubService {

  SigV4Utils = {
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

  private confides = new Subject<Array<ConfideModel> | null>();

  constructor() {
  }

  async startPubSub() {
    console.log('starting PubSub');

    const currentCredentials = await Auth.currentCredentials();
    const currentUser = await Auth.currentAuthenticatedUser();

    const endpoint = await this.createEndpoint(
      'ap-southeast-1',
      'a6os1sj5oe0re-ats.iot.ap-southeast-1.amazonaws.com',
      currentCredentials.accessKeyId,
      currentCredentials.secretAccessKey,
      currentCredentials.sessionToken,
    );

    const clientId = Math.random().toString(36).substring(7);
    const client = new Client(endpoint, clientId);
    const connectOptions = {
      useSSL: true,
      // timeout: 60 * 60 * 24,
      // keepAliveInterval: 60 * 60,
      cleanSession: false,
      onSuccess: () => {
        console.log('konek');

        client.subscribe('/confides');
        if (currentUser?.attributes?.sub) {
          client.subscribe(`/users/${currentUser?.attributes?.sub}`)
        }
      },
      onFailure: (e: any) => {
        console.log('diskonek', e);
      }
    };

    client.onConnectionLost = () => {
      console.log('diskonek');
    };

    client.onMessageArrived = (message) => {

      const payload = JSON.parse(message.payloadString);

      if (message.destinationName === '/confides') {
        this.sendConfides(payload);
      }
    }

    client.connect(connectOptions);
  }

  sendConfides(confides: any) {
    // reroute topic
    this.confides.next(confides);
  }

  getConfides(): Observable<any> {
    return this.confides.asObservable();
  }

  async createEndpoint(regionName: string, awsIotEndpoint: string, accessKey: string, secretKey: string, sessionToken: string) {
    // @ts-ignore
    const time = dayjs().utc();
    const dateStamp = time.format('YYYYMMDD');
    const amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    const service = 'iotdevicegateway';
    const region = regionName;
    const algorithm = 'AWS4-HMAC-SHA256';
    const method = 'GET';
    const canonicalUri = '/mqtt';
    const host = awsIotEndpoint;
    const credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    let canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    const canonicalHeaders = 'host:' + host + '\n';
    const payloadHash = this.SigV4Utils.sha256('');
    const canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
    const stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + this.SigV4Utils.sha256(canonicalRequest);
    const signingKey = this.SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
    const signature = this.SigV4Utils.sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken);

    return 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
  }
}
