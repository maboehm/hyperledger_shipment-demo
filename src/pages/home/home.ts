import { GlobalService } from './../../providers/global/global';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WebsocketProvider } from '../../providers/websocket/websocket';
import { Subscriber } from 'rxjs/Subscriber';
import { ToastController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { isArray } from 'ionic-angular/util/util';

import { ListPage } from '../list/list';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private url = "ws://kit-blockchain.duckdns.org:31090/"
  private shipmentData: any;
  private exceptionLength = 0;
  private shipmentId: string;

  constructor(
    public navCtrl: NavController,
    public webSocket: WebsocketProvider,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private global: GlobalService) {

    this.global.observeShipmentId().subscribe(next => this.shipmentId = next);
  }

  private detailClick(type: string, id: string) {
    this.navCtrl.push(ListPage, {
      type: type,
      id: id
    });
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

  private onButtonClick() {
    console.log("button");
    this.global.setShipmentId(this.shipmentId);
    this.presentToast("Lade Daten", 2000)
    this.updateChainData(this.shipmentId)
  }

  private updateChainData(shipmentId: string) {
    this.http.get("http://kit-blockchain.duckdns.org:31090/api/Shipment/" + shipmentId)
      .subscribe((data: any) => {
        console.log("Recieved data", data);
        data = isArray(data) ? data[0] : data;

        if (data.shipmentExceptions) {

          data.shipmentExceptions.map(a => a.timestamp = new Date(a.timestamp))
          data.shipmentExceptions = data.shipmentExceptions.sort((a, b) => b.timestamp - a.timestamp)
          if (this.exceptionLength > 0) {
            for (let i = 0; i < data.shipmentExceptions.length - this.exceptionLength; i++) {
              data.shipmentExceptions[i].highlight = true;
            }
          }
          console.log("sorted");
          this.exceptionLength = data.shipmentExceptions.length
        }
        this.shipmentData = data;
      },
      error => {
        this.shipmentData = null;
      })
  }

  private onShipmentException(data) {
    if (data.shipmentId != this.shipmentId) return;

    this.presentToast("A new Exception was committed to the Blockchain: '" + data.message + "'", 5000, () => {
      if (this.shipmentData && this.shipmentData.shipmentExceptions) {
        this.shipmentData.shipmentExceptions.map(a => a.highlight = false);
      }
    });
    this.updateChainData(this.shipmentId);
  }

  private ionViewDidLoad() {
    let openSubscriber = Subscriber.create(() => {
      console.info("websocket connection opened");
    });

    let observable = this.webSocket.createObservableSocket(this.url, openSubscriber)
      .map(message => JSON.parse(message));

    observable.subscribe(
      next => {
        console.log("event", next);
        switch (next.$class) {
          case "org.kit.blockchain.ShipmentExceptionEvent": this.onShipmentException(next);
            break;
          default: this.presentToast("New Event: " + next.$class, 3000, null, "top")
        }
      },
      error => console.log(error)
    )
  }
}
