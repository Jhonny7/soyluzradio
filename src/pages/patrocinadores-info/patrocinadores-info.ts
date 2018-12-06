import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-patrocinadores-info',
  templateUrl: 'patrocinadores-info.html',
})
export class PatrocinadoresInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatrocinadoresInfoPage');
  }

}
