import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscriber } from 'rxjs/Subscriber';
import { HttpClient } from "@angular/common/http";
import { isArray } from 'ionic-angular/util/util';

import { DetailPage } from '../detail/detail';

import { Logger } from '../../providers/logger/logger';
import { GlobalService } from '../../providers/global/global';
import { BlockchainRest } from '../../providers/blockchain/blockchain-rest';
import { WebsocketProvider } from '../../providers/websocket/websocket';
import { SimpleToast } from './../../providers/simpletoast/simpleToast';

/**
 * Displays a Shipment and the exceptions. When a relevant event occurs (ShipmentExceptions) it updates the view
 * and highlights the changes
 * @export
 * @class HomePage
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private shipmentData: any;
  private exceptionLength: number = 0;
  private shipmentId: string;

  constructor(
    private navCtrl: NavController,
    private webSocket: WebsocketProvider,
    private simpleToast: SimpleToast,
    private global: GlobalService,
    private blockchain: BlockchainRest) {

    this.shipmentId = this.global.shipmentId;
    this.global.observeShipmentId.subscribe(next => this.shipmentId = next);

    this.initWebsocket();
  }

  /**
   * Initializes the Websocket connection using the WebsocketProvider.
   * Registers the Listener to the ShiptmentException-Event
   */
  private initWebsocket() {
    let observable = this.webSocket.createObservableSocket();
    let defaultToast = (next) => this.simpleToast.present("New Event: " + next.$class, 3000, null, "top")

    observable.subscribe(
      next => {
        if (!this.shipmentData || next.shipmentId != this.shipmentId) {
          defaultToast(next);
          return;
        }

        switch (next.$class) {
          case "org.kit.blockchain.ShipmentExceptionEvent": this.onShipmentException(next);
            break;
          default: defaultToast(next);
        }
      }
    )
  }

  /**
   * Updates the chaindata given the shipment ID. Also highlights the new exceptions,
   * if the previously shown shipment was the same.
   */
  private updateChainData(shipmentId: string) {
    this.blockchain.getEntityDetail("Shipment", shipmentId)
      .subscribe((data: any) => {
        Logger.log("Recieved new Chain data", data);
        data = isArray(data) ? data[0] : data; // idk why, but sometimes I got an array...

        // exceptions do not come properly sorted...
        if (data.shipmentExceptions) {
          data.shipmentExceptions.map(a => a.timestamp = new Date(a.timestamp));
          data.shipmentExceptions = data.shipmentExceptions.sort((a, b) => b.timestamp - a.timestamp);

          // this means we are displaying data and want to highlight what changed
          if (this.exceptionLength > 0 && this.shipmentId === shipmentId) {
            for (let i = 0; i < data.shipmentExceptions.length - this.exceptionLength; i++) {
              data.shipmentExceptions[i].highlight = true;
            }
          }
          this.exceptionLength = data.shipmentExceptions.length;
        }
        this.shipmentData = data;
      },
      error => {
        Logger.warn("Error occured trying to get new Chain data", error);
        this.shipmentData = null;
      })
  }

  // Presents toast, disables highlight and starts to update the entire chain data
  private onShipmentException(data) {
    this.simpleToast.present("A new Exception was committed to the Blockchain: '" + data.message + "'", 5000, () => {
      if (this.shipmentData && this.shipmentData.shipmentExceptions) {
        this.shipmentData.shipmentExceptions.map(a => a.highlight = false);
      }
    });
    this.updateChainData(this.shipmentId);
  }

  // Navigates to the detail page, needs to provide type and string - see BlockchainRest
  // tslint:disable-next-line
  private detailClick(type: string, id: string) {
    this.navCtrl.push(DetailPage, {
      type: type,
      id: id
    });
  }


  // Updates the displayed data with the new shipmentId
  // tslint:disable-next-line
  private onShipmentSubmit() {
    this.global.shipmentId = this.shipmentId;
    this.simpleToast.present("Lade Daten", 2000);
    this.updateChainData(this.shipmentId)
  }
}
