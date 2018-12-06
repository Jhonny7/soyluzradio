import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProgramacionModel } from '../../models/programacionModel';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-programacion-multi-radio-info',
  templateUrl: 'programacion-multi-radio-info.html',
})
export class ProgramacionMultiRadioInfoPage {
  public programa:ProgramacionModel;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.programa = navParams.get('programa');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramacionMultiRadioInfoPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
  }

}
