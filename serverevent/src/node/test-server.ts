
import { injectable } from 'inversify';
import { TestServer,TestClient, ReconnectingFileSystemWatcherServer } from '../common/test-protocol';
import { JsonRpcProxyFactory } from '@theia/core';
//import { Emitter} from '@theia/core/lib/common';
/**
 * This class provides information on the device families and devices supported.
 */
@injectable()
export class TestServerImpl implements TestServer {
  onChange(): void {
    console.log('----------server side onchange----');
  }

  protected readonly proxyFactory = new JsonRpcProxyFactory<TestServer>();
  protected readonly remote = new ReconnectingFileSystemWatcherServer(this.proxyFactory.createProxy());

   constructor(){

    //this.remote.setClient({uname:'serveruname',onChange:()=>this.onChange()}
     // );
  
   }


  client:TestClient | any;
  dispose(): void {
   console.log('dispse');
  }
  setClient(client:TestClient ): Promise<void> {
    console.log('----------setclient----server---------');//function not getting called
    this.client = client;
    return Promise.resolve();
  }

  performAction(): Promise<number> {
    console.log('performAction: in server');
    this.client.onChange();//error:undefined client
   
    return Promise.resolve(1);
  }  
  
  
  

 

}