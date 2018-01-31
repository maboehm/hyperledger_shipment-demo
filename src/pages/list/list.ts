import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  type: String;
  id: String;
  data: any = "loading";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: HttpClient) {
    // If we navigated to this page, we will have an item available as a nav param
    this.type = navParams.get('type');
    this.id = navParams.get('id');
    console.log(this.type, this.id);

    this.http.get("http://kit-blockchain.duckdns.org:31090/api/" + this.type + "/" + this.id)
    .subscribe((data : any) => {
      console.log(data);
      this.data = data;
    });
  }
}
