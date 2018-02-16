import { Logger } from './../../providers/logger/logger';
import { BlockchainRest } from './../../providers/blockchain/blockchain-rest';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * This detail page shows entities from the blockchain as a preformatted block.
 * It expects the navParamgs type and id to build its html request
 *
 * @export
 * @class ListPage
 */
@Component({
  selector: 'detail',
  templateUrl: 'detail.html'
})

export class DetailPage {
  type: string;
  id: string;
  data: any = "loading";

  constructor(private navParams: NavParams,
    private blockchain: BlockchainRest) {

    // If we navigated to this page, we will have an item available as a nav param
    this.type = this.navParams.get('type');
    this.id = this.navParams.get('id');
    Logger.log(this.type, this.id);

    this.blockchain.getEntityDetail(this.type, this.id)
      .subscribe((data: any) => {
        Logger.log(data);
        this.data = data;
      });
  }
}
