import { HttpClient } from '@angular/common/http';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
/**
 * Provides access to the REST Server for all Pages
 *
 * @export
 * @class BlockchainRest
 */
@Injectable()
export class BlockchainRest {
  private url = AppConfig.REST_URL;

  constructor(private http: HttpClient) {
  }

  /**
   * Returns all the information from the blockchain that is available for this instance.
   *
   * @param {string} type Category of the entity, e.g. "Shipment"
   * @param {string} id Unique Identifier of the entity
   * @returns {Observable<any>} Observable that provides the unchanged response
   * @memberof BlockchainRest
   */
  public getEntityDetail(type: string, id: string): Observable<any> {
    return this.http.get(this.url + type + '/' + id);
  }

  /**
   * The current shipper can release a shipment, which is to be overtaken by the next shipper. Calls the
   * chaincode for ReleaseShipment, which performs checks and sets the status to "RELEASED" if succesfull.
   * @param shipper_old The shipper responsible for the previous section
   * @param shipper_new The shipper responsible for the next section
   * @param shipmentId the shipment id
   */
  public releaseShipment(shipper_old: string, shipper_new: string, shipmentId: string): Observable<Object> {
    let prefix = AppConfig.RESOURCE_NS + 'Shipper#';
    return this.http.post(this.url + 'ShipmentRelease', {
      shipper_old: prefix + shipper_old,
      shipper_new: prefix + shipper_new,
      shipment: shipmentId,
    })
  }

  /**
   * Can only be called, if the new shipper was not an old shipper.
   * Overtake ownership and responsibility for the shipment.
   * @param shipper_old The shipper responsible for the previous section
   * @param shipper_new The shipper responsible for the next section
   * @param shipmentId the shipment id
   */
  public overtakeShipment(shipper_old: string, shipper_new: string, shipmentId: string): Observable<Object> {
    let prefix = AppConfig.RESOURCE_NS + 'Shipper#';
    return this.http.post(this.url + 'ShipmentOvertake', {
      shipper_old: 'resource:org.kit.blockchain.Shipper#' + shipper_old,
      shipper_new: 'resource:org.kit.blockchain.Shipper#' + shipper_new,
      shipment: shipmentId,
    })
  }
}
