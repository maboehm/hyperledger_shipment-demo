import { WebsocketProvider } from './../../providers/websocket/websocket';
import { GlobalService } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Subscriber } from 'rxjs/Subscriber';

import { HttpClient } from "@angular/common/http";
import { isArray } from 'ionic-angular/util/util';

/**
 * Generated class for the TransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
})
export class TransferPage {
  private shipmentId: string;
  private shipmentData: any;
  private contract: any;
  private myID = "";
  private new_shipper = "";
  private old_shipper = "";
  private url = "ws://kit-blockchain.duckdns.org:31090/"


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public global: GlobalService,
    public toastCtrl: ToastController,
    public webSocket: WebsocketProvider) {

    this.myID = this.global.id;
    this.shipmentId = this.global.shipmentId;
    this.global.observeId.subscribe(next => this.myID = next);
    this.global.observeShipmentId.subscribe(next => this.shipmentId = next);
  }

  private releaseShipment() {
    this.presentToast("Releasing Shipment", 3000);
    this.http.post("http://kit-blockchain.duckdns.org:31090/api/ShipmentRelease", {
      "shipper_old": "resource:org.kit.blockchain.Shipper#" + this.myID,
      "shipper_new": "resource:org.kit.blockchain.Shipper#" + this.new_shipper,
      "shipment": this.shipmentId,
    }).subscribe((data: any) => {
      console.log(data)
      this.updateChainData(this.shipmentId);
      this.new_shipper = "";
    });
  }

  private onButtonClick() {
    this.presentToast("Getting Transfer Status", 3000);
    this.updateChainData(this.shipmentId);
  }

  private isReleasePossible() {
    return this.contract
      && this.shipmentData.status == "IN_TRANSIT"
      && this.contract.shippers.includes("resource:org.kit.blockchain.Shipper#" + this.myID);
  }

  private overtakeShipment() {
    this.presentToast("Overtaking Shipment", 3000);
    this.http.post("http://kit-blockchain.duckdns.org:31090/api/ShipmentOvertake", {
      "shipper_old": "resource:org.kit.blockchain.Shipper#" + this.old_shipper,
      "shipper_new": "resource:org.kit.blockchain.Shipper#" + this.myID,
      "shipment": this.shipmentId,
    }).subscribe((data: any) => {
      console.log(data)
      this.old_shipper = "";
      this.updateChainData(this.shipmentId);
    });
  }

  private isOvertakePossible() {
    return this.contract
      && this.shipmentData.status == "RELEASED"
      && !this.contract.shippers.includes("resource:org.kit.blockchain.Shipper#" + this.myID);
  }

  private getContract(id: string) {
    this.http.get("http://kit-blockchain.duckdns.org:31090/api/Contract/" + id)
      .subscribe((data: any) => {
        console.log(data);
        this.contract = data;
      });
  }

  private updateChainData(shipmentId: String) {
    this.http.get("http://kit-blockchain.duckdns.org:31090/api/Shipment/" + shipmentId)
      .subscribe((data: any) => {
        console.log("Recieved data", data);
        data = isArray(data) ? data[0] : data;
        this.shipmentData = data;

        this.getContract(this.shipmentData.contract.split("#")[1]);
      },
      error => {
        this.shipmentData = null;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferPage');

    let openSubscriber = Subscriber.create(() => {
      console.info("websocket connection opened");
    });

    let observable = this.webSocket.createObservableSocket(this.url, openSubscriber)
      .map(message => JSON.parse(message));

    observable.subscribe(
      next => {
        console.log("event", next);
        switch (next.$class) {
          case "org.kit.blockchain.ShipmentOvertakeEvent": this.onShipmentOvertakeEvent(next);
            break;
          case "org.kit.blockchain.ShipmentReleaseEvent": this.onShipmentReleaseEvent(next)
            break;
          default: this.presentToast("New Event: " + next.$class, 3000, null, "top")
        }
      },
      error => console.log(error)
    )
  }

  private onShipmentOvertakeEvent(event) {
    console.log("overtake:", event);
    let longID = "resource:org.kit.blockchain.Shipper#" + this.myID
    if (event.shipper_new == longID || event.shipper_old == longID) {
      this.presentToast("An Overtake Event for you for shipment '" + event.shipmentId + "'", 5000, null, "top");
    }
  }
  private onShipmentReleaseEvent(event) {
    if (event.shipper_new.email == this.myID || event.shipper_old.email == this.myID) {
      this.presentToast("A Release Event for you for shipment '" + event.shipmentId + "'", 5000, null, "top");
    }
  }

  private presentToast(message, time, onDismiss?, position?) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: time,
      position: position ? position : 'bottom',
      showCloseButton: true,
      closeButtonText: "OK"
    });
    let onDidDismiss = onDismiss ? onDismiss : () => console.log('Dismissed toast')
    toast.onDidDismiss(onDidDismiss)

    toast.present();
  }

}
