import { HomePage } from './../pages/home/home';
import { GlobalService } from './../providers/global/global';
import { TransferPage } from './../pages/transfer/transfer';
import { InfoPage } from './../pages/info/info';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any, icon: string }>;
  verifiedId = false;
  myId: string;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private global: GlobalService) {


    this.myId = this.global.id;
    this.global.observeId.subscribe(next => this.myId = next);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Shipment Status', component: HomePage, icon: "cube" },
      { title: 'Transfer', component: TransferPage, icon: "share-alt" },
      { title: 'Info', component: InfoPage, icon: "information-circle" }
    ];

  }

  // tslint:disable-next-line:no-unused-variable
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
