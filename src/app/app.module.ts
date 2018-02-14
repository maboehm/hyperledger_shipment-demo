import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { GlobalService } from './../providers/global/global';
import { TransferPage } from './../pages/transfer/transfer';
import { DetailPage } from './../pages/detail/detail';
import { InfoPage } from './../pages/info/info';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { registerLocaleData } from '@angular/common';
import localDe from '@angular/common/locales/de';

import { WebsocketProvider } from '../providers/websocket/websocket';
import { BlockchainRest } from './../providers/blockchain/blockchain-rest';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";

// the second parameter 'fr' is optional
registerLocaleData(localDe, 'fr');

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InfoPage,
    DetailPage,
    TransferPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InfoPage,
    DetailPage,
    TransferPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    WebsocketProvider,
    BlockchainRest,
    GlobalService
  ]
})
export class AppModule { }
