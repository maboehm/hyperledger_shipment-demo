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
  private id: string;
  private shipmentId: string;
  private idSubject: Subject<string> = new Subject();
  private shipmentIdSubject: Subject<string>  = new Subject;

  private ID = "myId";
  private SHIPMENT_ID = "shipmentId";

  constructor(private storage: Storage) {
    this.storage.get(this.ID).then(id => {
      if (id) {
        this.id = id;
        this.idSubject.next(id);
      }
    });
    this.storage.get(this.SHIPMENT_ID).then(id => {
      if (id) {
        this.shipmentId = id;
        this.shipmentIdSubject.next(id);
      }
    });
  }

  /*
   * Id getter/setter
   */
  setId(newValue: string) {
    this.storage.set(this.ID, newValue);
    this.id = newValue;
    this.idSubject.next(newValue);
  }

  getId(): string {
    return this.id;
  }

  observeId(): Subject<string> {
    return this.idSubject;
  }

  /**
   * shipmentId getter/setter
   */
  setShipmentId(newValue: string) {
    this.storage.set(this.SHIPMENT_ID, newValue);
    this.shipmentId = newValue;
    this.shipmentIdSubject.next(newValue);
  }

  getShipmentId(): string {
    return this.shipmentId;
  }

  observeShipmentId(): Subject<string> {
    return this.shipmentIdSubject;
  }
}
