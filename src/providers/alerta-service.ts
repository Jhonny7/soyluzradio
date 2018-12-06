import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the AlertaServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertaServiceProvider {

  constructor(public http: HttpClient, public alertCtrl: AlertController) {

  }

  alertaBasica(titulo: string, subtitulo: string, accion: any) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      cssClass: 'alertCustomCss',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            if(accion!=null){
              accion();
            }
          }
        }
      ]
    });
    alert.present();
  }

  warnAlert(titulo: string, subtitulo: string, accion: any) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      cssClass: 'warnAlert',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            if(accion!=null){
              accion();
            }
          }
        }
      ]
    });
    alert.present();
  }

  errorAlert(titulo: string, subtitulo: string, accion: any) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      cssClass: 'errorAlert',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            if(accion!=null){
              accion();
            }
          }
        }
      ]
    });
    alert.present();
  }

  alertaConfirmacion(titulo: string, mensaje: string, accionAceptar: Function, accionCancelar: Function) {
    const confirm = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            if (accionCancelar != null) {
              accionCancelar();
            }
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            accionAceptar();
          }
        }
      ]
    });
    confirm.present();
  }

  alertaInput(titulo: string, mensaje: string, accionAceptar: any, accionCancelar: any, inputsE: any[]) {
    const prompt = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      inputs: inputsE,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            if (accionCancelar != null) {
              accionCancelar();
            }
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            accionAceptar();
          }
        }
      ]
    });
    prompt.present();
  }
}
