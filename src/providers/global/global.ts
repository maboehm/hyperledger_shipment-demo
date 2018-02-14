import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
/**
 * Global Service that handles variables, which are stored in the app storage
 * to be accessible accross sections
 *
 * Handles "id" and "shipmentId"
 *
 * @export
 * @class GlobalService
 */
@Injectable()

export class GlobalService {
  private _id: string;
  private _shipmentId: string;
  private idSubject: Subject<string> = new Subject();
  private shipmentIdSubject: Subject<string> = new Subject;

  private ID = "myId";
  private SHIPMENT_ID = "shipmentId";

  constructor(private storage: Storage) {
    this.storage.get(this.ID).then(id => {
      if (id) {
        this._id = id;
        this.idSubject.next(id);
      }
    });
    this.storage.get(this.SHIPMENT_ID).then(id => {
      if (id) {
        this._shipmentId = id;
        this.shipmentIdSubject.next(id);
      }
    });
  }

  /*
   * Id getter/setter
   */
  set id(newValue: string) {
    this.storage.set(this.ID, newValue);
    this._id = newValue;
    this.idSubject.next(newValue);
  }

  get id(): string {
    return this._id;
  }

  get observeId(): Subject<string> {
    return this.idSubject;
  }

  /**
   * shipmentId getter/setter
   */
  set shipmentId(newValue: string) {
    this.storage.set(this.SHIPMENT_ID, newValue);
    this._shipmentId = newValue;
    this.shipmentIdSubject.next(newValue);
  }

  get shipmentId(): string {
    return this._shipmentId;
  }

  get observeShipmentId(): Subject<string> {
    return this.shipmentIdSubject;
  }
}
