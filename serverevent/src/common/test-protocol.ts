


/********************************************************************************
 * Copyright (C) 2018 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

export const testPath = '/services/Test123Event';



export const TestServer = Symbol('TestServer');

// import { Event } from '@theia/core/lib/common/event';
import { JsonRpcServer, JsonRpcProxy } from '@theia/core';
import { injectable, inject } from 'inversify';


export interface TestClient{   
    uname:string; 
    onChange():void;
}
export interface TestServer extends JsonRpcServer<TestClient> {  
  
    performAction(): Promise<number>;   
    
}





export const TestServerProxy = Symbol('TestServerProxy');
export type TestServerProxy = JsonRpcProxy<TestServer>;


@injectable()
export class ReconnectingFileSystemWatcherServer implements TestServer {
   

    protected watcherSequence = 0;
    protected readonly watchParams = new Map<number, {
        uri: string
       
    }>();
    protected readonly localToRemoteWatcher = new Map<number, number>();

    constructor(
        @inject(TestServerProxy) protected readonly proxy: TestServerProxy
    ) {
        const onInitialized = this.proxy.onDidOpenConnection(() => {
            // skip reconnection on the first connection
            onInitialized.dispose();
            this.proxy.onDidOpenConnection(() => this.reconnect());
        });
    }

    protected reconnect(): void {
        for (const [watcher] of this.watchParams.entries()) {
            this.doWatchFileChanges(watcher);
        }
    }

    dispose(): void {
        this.proxy.dispose();
    }


    performAction(): Promise<number> {
        const watcher = this.watcherSequence++;
        this.watchParams.set(watcher, { uri:'manju'});
        return this.doWatchFileChanges(watcher);
    }

    protected doWatchFileChanges(watcher: number): Promise<number> {
        return this.proxy.performAction().then(remote => {
            this.localToRemoteWatcher.set(watcher, remote);
            return watcher;
        });
    }


    setClient(client: TestClient | any): void {
        console.log('----------ReconnectingFileSystemWatcherServer setclient-'+client.uname);
        this.proxy.setClient(client);
    }

}