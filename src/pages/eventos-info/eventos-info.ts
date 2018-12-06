import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { EventosMapPage } from '../eventos-map/eventos-map';
import 'rxjs/add/operator/timeout';
import { RestServiceProvider } from '../../providers/rest-service';

@IonicPage()
@Component({
  selector: 'page-eventos-info',
  templateUrl: 'eventos-info.html',
})
export class EventosInfoPage {

  public evento:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
    public alertaService:AlertaServiceProvider, public restService:RestServiceProvider) {
    this.evento = navParams.get('evento');
    console.log(this.evento);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IglesiasInfoPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
  }

  irMapa(){
    console.log(this.evento);
    if(this.evento.latitud == null && this.evento.longitud == null){
      //Consumir servicio para agregar latitudes
      this.alertaService.warnAlert(this.restService.headerValidacion,"El evento seleccionado no cuenta con éste servicio",null);
    }else{
      this.navCtrl.push(EventosMapPage,{evento:this.evento});
    }
  }
}
