import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DOCUMENT } from '@angular/common';
import 'rxjs/add/operator/timeout';
import { RestServiceProvider } from '../../providers/rest-service';
import { PublicidadModel } from '../../models/publicidadModel';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-radio',
  templateUrl: 'radio.html',
})


export class RadioPage {

  public audio: Boolean = true;
  public publicidades: PublicidadModel[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    @Inject(DOCUMENT) private document: any, public restService: RestServiceProvider, public alertaService: AlertaServiceProvider,
    public iap: InAppBrowser, public localStorage: Storage) {
    console.log(document);

    this.localStorage.ready().then(() => {
      this.localStorage.get(`@playSoyLuz`).then((data) => {
        if(data == 1){
          this.audio = false;
        }else{
          this.audio = true;
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadioPage');
    //Cargar Slides
    let loading = this.loadingCtrl.create();
    this.publicidades = [];
    loading.present();
    var form = new FormData();
    let params = new HttpParams();
    var form = new FormData();
    this.restService.restServicePOST("publicidad/banner", form).timeout(this.restService.timeOver).subscribe(
      data => {
        console.log(data);
        if (data['status'] == "A") {
          if (data['parameters'].length > 0) {
            let array = data['parameters'];
            array.forEach(p => {
              var programa = new PublicidadModel(p.id, p.descripcion, p.url, p.imagen, p.fecha_alta);
              this.publicidades.push(programa);
            });
            console.log(this.publicidades);
            //Determina a donde va
            loading.dismiss();
          } else {
            loading.dismiss();
          }
        } else {
          loading.dismiss();
        }
      }, (error) => {
        console.log(error);
        loading.dismiss();
      });
  }

  pauseRadio() {
    console.log("pausando");
    var miaudio = this.document.getElementById('soy');
    this.localStorage.ready().then(() => {
      this.localStorage.get(`@playSoyLuz`).then((data) => {
        if(data == 1){
          this.localStorage.set(`@playSoyLuz`, 0);//esto es lo mismo que --->  'local'+id
          miaudio.pause();
          this.audio = true;
        }else{
          this.alertaService.warnAlert(this.restService.headerValidacion,"Contacta al administrador",null);
        }
      });
    });
  }

  playRadio() {
    console.log("play radio");
    var miaudio = this.document.getElementById('soy');
    this.localStorage.ready().then(() => {
      this.localStorage.set(`@playSoyLuz`, 1);//esto es lo mismo que --->  'local'+id
      miaudio.play();
      this.audio = false;
    });
  }

  irA(publicidad: PublicidadModel) {
    if (publicidad.url !== null) {
      this.iap.create(publicidad.url.toString(), "_self");
    }
  }

}
