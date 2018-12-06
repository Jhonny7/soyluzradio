import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-ministerios-info',
  templateUrl: 'ministerios-info.html',
})
export class MinisteriosInfoPage {

  public ministerio:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.ministerio = navParams.get('ministerio');
    console.log(this.ministerio);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinisteriosInfoPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
  }

}
