## API Report File for "@bentley/electron-manager"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AsyncMethodsOf } from '@bentley/imodeljs-frontend';
import { BrowserWindow } from 'electron';
import { BrowserWindowConstructorOptions } from 'electron';
import { DesktopAuthorizationClient } from '@bentley/imodeljs-backend';
import { IModelAppOptions } from '@bentley/imodeljs-frontend';
import { IModelHostConfiguration } from '@bentley/imodeljs-backend';
import { IpcHandler } from '@bentley/imodeljs-backend';
import { PromiseReturnType } from '@bentley/imodeljs-frontend';
import { RpcConfiguration } from '@bentley/imodeljs-common';
import { RpcInterfaceDefinition } from '@bentley/imodeljs-common';

// @internal
export class DesktopAuthorizationClientIpc {
    static get desktopAuthorizationClient(): DesktopAuthorizationClient | undefined;
    static initializeIpc(): void;
    }

// @beta
export class ElectronApp {
    static callApp<T extends AsyncMethodsOf<Electron.App>>(methodName: T, ...args: Parameters<Electron.App[T]>): Promise<PromiseReturnType<Electron.App[T]>>;
    static callDialog<T extends AsyncMethodsOf<Electron.Dialog>>(methodName: T, ...args: Parameters<Electron.Dialog[T]>): Promise<PromiseReturnType<Electron.Dialog[T]>>;
    static callShell<T extends AsyncMethodsOf<Electron.Shell>>(methodName: T, ...args: Parameters<Electron.Shell[T]>): Promise<PromiseReturnType<Electron.Shell[T]>>;
    // (undocumented)
    static get isValid(): boolean;
    // (undocumented)
    static shutdown(): Promise<void>;
    static startup(opts?: {
        iModelApp?: IModelAppOptions;
    }): Promise<void>;
}

// @beta
export class ElectronHost {
    // (undocumented)
    static get app(): Electron.App;
    // (undocumented)
    static appIconPath: string;
    // (undocumented)
    static get electron(): typeof Electron;
    // (undocumented)
    static frontendURL: string;
    // (undocumented)
    static get ipcMain(): Electron.IpcMain;
    // (undocumented)
    static get isValid(): boolean;
    static get mainWindow(): BrowserWindow | undefined;
    static openMainWindow(windowOptions?: BrowserWindowConstructorOptions): Promise<void>;
    // (undocumented)
    static rpcConfig: RpcConfiguration;
    static startup(opts?: {
        electronHost?: ElectronHostOptions;
        iModelHost?: IModelHostConfiguration;
    }): Promise<void>;
    // (undocumented)
    static webResourcesPath: string;
}

// @beta
export interface ElectronHostOptions {
    developmentServer?: boolean;
    frontendPort?: number;
    frontendURL?: string;
    iconName?: string;
    ipcHandlers?: (typeof IpcHandler)[];
    rpcInterfaces?: RpcInterfaceDefinition[];
    webResourcesPath?: string;
}


// (No @packageDocumentation comment for this package)

```
