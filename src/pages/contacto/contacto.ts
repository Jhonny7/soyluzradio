import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the ContactoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacto',
  templateUrl: 'contacto.html',
})
export class ContactoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public iap: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactoPage');
  }

  clickPagina(pagina:any){
    this.iap.create(pagina,"_self");
  }

}
