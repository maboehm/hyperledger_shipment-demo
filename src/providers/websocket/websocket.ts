import { AppConfig } from './../../app/app.config';
import { Logger } from './../logger/logger';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class WebsocketProvider {
  private ws: WebSocket;

  createObservableSocket(): Observable<any> {
    this.ws = new WebSocket(AppConfig.EVENT_URL);
    let obs = new Observable(observer => {
      this.ws.onmessage = event => {
        Logger.log("Received new web socket message:", event.data);
        observer.next(event.data);
      }
      this.ws.onerror = event => {
        Logger.warn("Error receiving from websocket:", event)
      };
      this.ws.onclose = event => {
        Logger.log("Websocket connection closed");
        observer.complete();
      };
      this.ws.onopen = event => {
        Logger.log("web socket connection opened");
      };

      return () => this.ws.close();
    });

    return obs.map((message: string) => JSON.parse(message));
  }
}
