import { HomePage } from './../pages/home/home';
import { GlobalService } from './../providers/global/global';
import { TransferPage } from './../pages/transfer/transfer';
import { InfoPage } from './../pages/info/info';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApplicationRef } from '@angular/core';

import { DetailPage } from '../pages/detail/detail';
import { dispatchEvent } from '@angular/core/src/view/util';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TransferPage;

  pages: Array<{ title: string, component: any, icon: string }>;
  verifiedId = false;
  myId: string;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public global: GlobalService, public ref: ApplicationRef) {

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Shipment Status', component: HomePage, icon: "cube" },
      { title: 'Transfer', component: TransferPage, icon: "share-alt" },
      { title: 'Info', component: InfoPage, icon: "information-circle" }
    ];

  }
  private ionViewDidLoad() {
    console.log("did load");
  }

  private menuOpened() {
    console.log("menu opened");
    this.myId = this.global.id;
    this.ref.tick();
  }

  private idChanged(event) {
    this.global.id = this.myId;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
