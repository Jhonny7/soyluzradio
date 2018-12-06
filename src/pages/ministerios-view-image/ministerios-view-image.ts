import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-ministerios-view-image',
  templateUrl: 'ministerios-view-image.html',
})
export class MinisteriosViewImagePage {

  public pathImage:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,public modalController: ModalController) {
    //getMinisterioPorCategoria
    this.pathImage = navParams.get('pathImage');
    console.log(this.pathImage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinisteriosViewPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
  }

}
