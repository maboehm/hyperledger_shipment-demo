import { Component } from '@angular/core';

import { isArray } from 'ionic-angular/util/util';

import { WebsocketProvider } from './../../providers/websocket/websocket';
import { GlobalService } from './../../providers/global/global';
import { SimpleToast } from './../../providers/simpletoast/simpleToast';
import { BlockchainRest } from './../../providers/blockchain/blockchain-rest';
import { Logger } from './../../providers/logger/logger';
import { AppConfig } from '../../app/app.config';


@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
})
export class TransferPage {
  private shipmentId: string;
  private shipmentData: any;
  private contract: any;
  private myId = '';
  private new_shipper = '';
  private old_shipper = '';


  constructor(
    private global: GlobalService,
    private simpleToast: SimpleToast,
    private webSocket: WebsocketProvider,
    private blockchain: BlockchainRest) {

    this.myId = this.global.id;
    this.shipmentId = this.global.shipmentId;
    this.global.observeId.subscribe(next => this.myId = next);
    this.global.observeShipmentId.subscribe(next => this.shipmentId = next);

    this.initWebsocket();
  }

  // Queries the blockchain for the given contract id
  private getContract(id: string) {
    this.blockchain.getEntityDetail('Contract', id)
      .subscribe((data: any) => {
        Logger.log(data);
        this.contract = data;
      });
  }

  // Updates the chaindata, of which only a some information is displayed
  private updateChainData(shipmentId: string) {
    this.blockchain.getEntityDetail('Shipment', shipmentId)
      .subscribe((data: any) => {
        Logger.log('Recieved data', data);
        data = isArray(data) ? data[0] : data;
        this.shipmentData = data;

        this.getContract(this.shipmentData.contract.split('#')[1]);
      },
      error => {
        this.shipmentData = null;
      })
  }

  // Initializes the websocket and registers the listeners
  private initWebsocket() {
    let observable = this.webSocket.createObservableSocket();

    observable.subscribe(
      next => {
        switch (next.$class) {
          case AppConfig.NS + 'ShipmentOvertakeEvent': this.onShipmentOvertakeEvent(next);
            break;
          case AppConfig.NS + 'ShipmentReleaseEvent': this.onShipmentReleaseEvent(next)
            break;
          default: this.simpleToast.present('New Event: ' + next.$class, 3000, null, 'top')
        }
      }
    )
  }

  // Shows a simple toast, when a relevant overtake event was received
  private onShipmentOvertakeEvent(event) {
    Logger.log('overtake:', event);
    let longID = AppConfig.RESOURCE_NS + 'Shipper#' + this.myId
    if (event.shipper_new == longID || event.shipper_old == longID) {
      this.simpleToast.present('An Overtake Event for you for shipment "' + event.shipmentId + '"', 5000, null, 'top');
    }
  }

  // Simply shows a toast, when a relevant release event occured
  private onShipmentReleaseEvent(event) {
    if (event.shipper_new.email == this.myId || event.shipper_old.email == this.myId) {
      this.simpleToast.present('A Release Event for you for shipment "' + event.shipmentId + '"', 5000, null, 'top');
    }
  }

  // Executes the releaseShipment Chaincode and updates the view
  // tslint:disable-next-line:no-unused-variable
  private releaseShipment() {
    this.simpleToast.present('Releasing Shipment', 3000);
    this.blockchain.releaseShipment(this.myId, this.new_shipper, this.shipmentId)
      .subscribe((data: any) => {
        Logger.log(data)
        this.updateChainData(this.shipmentId);
        this.new_shipper = '';
      });
  }

  // When the form is submitted the view is updated
  // tslint:disable-next-line:no-unused-variable
  private onCheckButtonClick() {
    this.simpleToast.present('Getting Transfer Status', 3000);
    this.updateChainData(this.shipmentId);
  }

  // A release is possible, when the good is 'IN_TRANSIT' and I am the current shipper
  // tslint:disable-next-line:no-unused-variable
  private isReleasePossible() {
    let longId = AppConfig.RESOURCE_NS + 'Shipper#' + this.myId
    return this.contract
      && this.shipmentData.status == 'IN_TRANSIT'
      && this.contract.shippers.includes(longId);
  }

  // A Overtake is possible, when the status is 'RELEASED' and I am not yet part of the shippers
  // tslint:disable-next-line:no-unused-variable
  private isOvertakePossible() {
    let longId = AppConfig.RESOURCE_NS + 'Shipper#' + this.myId
    return this.contract
      && this.shipmentData.status == 'RELEASED'
      && !this.contract.shippers.includes(longId);
  }

  // Executes the overtakeShipment Chaincode and updates the view
  // tslint:disable-next-line:no-unused-variable
  private overtakeShipment() {
    this.simpleToast.present('Overtaking Shipment', 3000);
    this.blockchain.overtakeShipment(this.old_shipper, this.myId, this.shipmentId)
      .subscribe((data: any) => {
        Logger.log(data)
        this.old_shipper = '';
        this.updateChainData(this.shipmentId);
      });
  }
}
