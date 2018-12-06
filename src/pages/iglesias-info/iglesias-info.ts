import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { IglesiasMapPage } from '../iglesias-map/iglesias-map';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import 'rxjs/add/operator/timeout';
import { RestServiceProvider } from '../../providers/rest-service';
import { IglesiasMapIndicationsPage } from '../iglesias-map-indications/iglesias-map-indications';

@IonicPage()
@Component({
  selector: 'page-iglesias-info',
  templateUrl: 'iglesias-info.html',
})
export class IglesiasInfoPage {
  public iglesia:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
    public alertaService:AlertaServiceProvider, public restService:RestServiceProvider) {
    this.iglesia = navParams.get('iglesia');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IglesiasInfoPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
  }

  irMapa(){
    console.log(this.iglesia);
    if(this.iglesia.latitud == null && this.iglesia.longitud == null){
      //Consumir servicio para agregar latitudes
      this.alertaService.warnAlert(this.restService.headerValidacion,"La iglesia seleccionada aun no cuenta con éste servicio",null);
    }else{
      this.navCtrl.push(IglesiasMapPage,{iglesia:this.iglesia});
    }
  }

  comoLlegar(){
    if(this.iglesia.latitud == null && this.iglesia.longitud == null){
      //Consumir servicio para agregar latitudes
      this.alertaService.warnAlert(this.restService.headerValidacion,"La iglesia seleccionada aun no cuenta con éste servicio",null);
    }else{
      this.navCtrl.push(IglesiasMapIndicationsPage,{iglesia:this.iglesia});
    }
  }

}
