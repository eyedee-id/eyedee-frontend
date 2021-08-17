import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {Client, Message} from 'paho-mqtt';

import dayjs from "dayjs";
import {ConfideModel} from "../models/confide.model";
import {nanoid} from "nanoid";
import {SigV4Utils} from '../libs/sig-v4';
import {ApiService} from "./api.service";

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

@Injectable()
export class PubSubService {

  private readonly endpoint = 'a6os1sj5oe0re-ats.iot.ap-southeast-1.amazonaws.com';
  private readonly clientId: string;

  private _clientStatus = new BehaviorSubject<boolean>(false);
  private client: Client | null = null;
  private credentials: { accessKeyId: string, secretAccessKey: string, sessionToken: string } = {
    sessionToken: '',
    secretAccessKey: '',
    accessKeyId: ''
  };

  private confides = new Subject<Array<ConfideModel> | null>();

  constructor(
    private apiService: ApiService,
  ) {
    this.clientId = nanoid(32);
  }

  updateCredentials(credentials: { accessKeyId: string, secretAccessKey: string, sessionToken: string }) {
    this.credentials = credentials;
  }

  clientStatus() {
    return this._clientStatus.asObservable();
  }

  start() {
    if (this.client && this.client.isConnected()) {
      return;
    }

    console.debug("[ws] start");
    this.client = this.getClient(this.credentials);

    this.client.onConnectionLost = (e) => {
      console.debug('[ws] disconnected', e);
      this._clientStatus.next(false);

      // coba buat reconnect
      this.start();
    };

    this.client.onMessageArrived = (message: Message) => {
      const payload = JSON.parse(message.payloadString);
      if (message.destinationName === '/confides') {
        this.sendConfides(payload);
      }
    }
  }

  stop() {
    if (!this.client) {
      return;
    }

    console.debug("[ws] stop");
    this.client.disconnect();
  }

  subscribeTopics(topics: Array<string>) {
    for (let topic of topics) {
      this.client?.subscribe(topic);
    }
  }

  unsubscribeTopics(topics: Array<string>) {
    for (let topic of topics) {
      this.client?.unsubscribe(topic);
    }
  }

  sendConfides(confides: any) {
    this.confides.next(confides);
  }

  getConfides(): Observable<any> {
    return this.confides.asObservable();
  }

  iotPolicyAttachConnect(data: { identity_id: string }) {
    return this.apiService.post('v1/auth/iot/policy/', `/attach-connect`, data);
  }

  private getClient(credentials: { accessKeyId: string, secretAccessKey: string, sessionToken: string }): Client {
    const endpoint = this.createEndpoint(
      'ap-southeast-1',
      this.endpoint,
      credentials.accessKeyId,
      credentials.secretAccessKey,
      credentials.sessionToken,
    );

    const connectOptions = {
      useSSL: true,
      timeout: 3,
      cleanSession: false,
      onSuccess: () => {
        console.debug("[ws] connected");
        this._clientStatus.next(true);
      },
    };

    const _client = new Client(endpoint, this.clientId);
    _client.connect(connectOptions);

    return _client;
  }

  private createEndpoint(regionName: string, awsIotEndpoint: string, accessKey: string, secretKey: string, sessionToken: string) {
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
    const payloadHash = SigV4Utils.sha256('');
    const canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
    const stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + SigV4Utils.sha256(canonicalRequest);
    const signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
    const signature = SigV4Utils.sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken);

    return 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
  }
}
