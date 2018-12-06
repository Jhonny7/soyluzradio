import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RadioModel } from '../../models/radioModel';
import { DOCUMENT } from '@angular/common';
import 'rxjs/add/operator/timeout';
import { RestServiceProvider } from '../../providers/rest-service';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { PublicidadModel } from '../../models/publicidadModel';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-radio-multiple-view',
  templateUrl: 'radio-multiple-view.html',
})
export class RadioMultipleViewPage {

  public radio: RadioModel;
  public audio: Boolean = true;
  public publicidades: PublicidadModel[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    @Inject(DOCUMENT) private document: any, public restService: RestServiceProvider, public alertaService: AlertaServiceProvider,
    public iap: InAppBrowser) {
    this.radio = navParams.get('radio');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadioMultipleViewPage');
    let loading = this.loadingCtrl.create();
    this.publicidades = [];
    loading.present();
    var form = new FormData();
    let params = new HttpParams();
    var form = new FormData();
    this.restService.restServicePOST("publicidad/banner", form).timeout(this.restService.timeOver).subscribe(
      programacion => {
        if (programacion['status'] == "A") {
          if (programacion['parameters'].length > 0) {
            let array = programacion['parameters'];
            array.forEach(p => {
              var programa = new PublicidadModel(p.id, p.descripcion, p.url, p.imagen, p.fecha_alta);
              this.publicidades.push(programa);
            });
            //Determina a donde va
            loading.dismiss();
          } else {
            loading.dismiss();
          }
        } else {
          loading.dismiss();
        }
      }, (error) => {
        loading.dismiss();
      });
  }

  pauseRadio() {
    console.log("pausando");
    var miaudio = this.document.getElementById('soy');
    miaudio.pause();
    this.audio = true;
  }

  playRadio() {
    console.log("play radio");
    var miaudio = this.document.getElementById('soy');
    miaudio.play();
    this.audio = false;
  }

  irA(publicidad:PublicidadModel){
    if(publicidad.url !== null){
      this.iap.create(publicidad.url.toString(),"_self");
    }
  }

}
