import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RadioModel } from '../../models/radioModel';
import { RadioMultipleViewPage } from '../radio-multiple-view/radio-multiple-view';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-radio-multiple',
  templateUrl: 'radio-multiple.html',
})
export class RadioMultiplePage {
  public radios:RadioModel[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.radios = navParams.get('radios');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadioMultiplePage');
  }

  clickRadio(radio:RadioModel){
    this.navCtrl.push(RadioMultipleViewPage,{radio});
  }

}
