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
    return this.http.get(this.url + type + "/" + id);
  }
}
