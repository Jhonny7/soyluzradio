import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PatrocinadorModel } from '../../models/patrocinadoresModel';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-patrocinadores',
  templateUrl: 'patrocinadores.html',
})
export class PatrocinadoresPage {
  public patrocinadores:PatrocinadorModel[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public iap: InAppBrowser) {
    this.patrocinadores = navParams.get('patrocinadores');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatrocinadoresPage');
  }

  clickPatrocinador(patrocinador:PatrocinadorModel){
    this.iap.create(patrocinador.paginaWeb.toString(),"_self");
  }

}
