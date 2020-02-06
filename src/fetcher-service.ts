import axios from 'axios';
import { DemistoProperties } from './types/demisto-properties';
import { User } from './types/user';
import { ApiStatus } from './types/api-status';
import { ClientOptions } from './types/client-options';
import { DemistoCaseParams } from './types/demisto-case-params';
import { JSEncrypt } from 'jsencrypt';

export class FetcherService {

  demistoProperties: DemistoProperties; // gets set during test
  currentUser: User;
  apiPath = '/api';
  private publicKey: string;
  encryptor: any;



  getPublicKey(): Promise<void> {
    let headers = this.buildHeaders();
    return axios.get(this.apiPath + '/publicKey', { headers } )
                .then( response => response.data )
                .then( (value: any) => this.publicKey = value.publicKey );
  }



  async initEncryption(): Promise<any> {
    await this.getPublicKey();
    this.encryptor = new JSEncrypt();
    this.encryptor.setPublicKey(this.publicKey);
  }



  encrypt(str: string): string {
    return this.encryptor.encrypt(str);
  }

    
  getLoggedInUser(): Promise<User> {
    let headers: any = { Accept: 'application/json' };
    return axios.get(this.apiPath + '/whoami', { headers } )
                    .then( response => response.data )
                    .then( (user: User) => {
                      this.currentUser = user;
                      return user;
                     } );
  }



  getApiStatus(): Promise<ApiStatus> {
    let headers: any = { Accept: 'application/json' };
    return axios.get(this.apiPath + '/apiStatus', { headers } )
                    .then( response => response.data )
                    .then( (status: ApiStatus) => status );
  }



  getClientOptions(): Promise<ClientOptions> {
    let headers: any = { Accept: 'application/json' };
    return axios.get(this.apiPath + '/clientOptions', { headers } )
                    .then( response => response.data )
                    .then( (clientOptions: ClientOptions) => clientOptions );
  }



  buildHeaders(authUser: string|null = null): any {
    let headers: any = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };
    if (authUser) {
      headers['Authorization'] = authUser;
    }
    return headers;
  }



  testDemisto( demistoProperties: DemistoProperties ): Promise<any> {
    console.log('demistoProperties:', demistoProperties);
    if ('apiKey' in demistoProperties) {
      demistoProperties.apiKey = this.encrypt(demistoProperties.apiKey);
    }
    console.log('demistoProperties:', demistoProperties);
    this.demistoProperties = demistoProperties;
    let headers = this.buildHeaders();
    return axios.post(this.apiPath + '/testConnect', demistoProperties, { headers } )
                    .then( response => response.data );
  }



  createDemistoIncident( params: DemistoCaseParams ): Promise<any> {
    let headers = this.buildHeaders(this.currentUser.username);
    console.log('Current User: ', this.currentUser.username);
    return axios.post(this.apiPath + '/createDemistoIncident', params, { headers } )
                    .then( response => response.data )
  }

}
