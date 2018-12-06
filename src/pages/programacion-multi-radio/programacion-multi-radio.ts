import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { RadioModel } from '../../models/radioModel';
import { RestServiceProvider } from '../../providers/rest-service';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { ProgramacionModel } from '../../models/programacionModel';
import { ProgramacionMultiRadioViewPage } from '../programacion-multi-radio-view/programacion-multi-radio-view';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-programacion-multi-radio',
  templateUrl: 'programacion-multi-radio.html',
})
export class ProgramacionMultiRadioPage {
  public radios:RadioModel[]=[];
  public programas:ProgramacionModel[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public restService: RestServiceProvider,
    public alertaService: AlertaServiceProvider, public loadingCtrl: LoadingController, public modalController: ModalController) {
    this.radios = navParams.get('radios');
  }

  ionViewDidLoad() {
  }

  clickRadio(radio:RadioModel){
    let loading = this.loadingCtrl.create();

    loading.present();
    var form = new FormData();
      form.append("id", radio.id.toString());//
    this.restService.restServicePOST("programacion/getProgramacionByIdRadio", form).timeout(this.restService.timeOver).subscribe(
      programacion => {
        if (programacion['status'] == "A") {
          if (programacion['parameters'].length > 0) {
            let array = programacion['parameters'];
            array.forEach(p => {
              var programa = new ProgramacionModel(p.id,p.id_radio,p.imagen,p.nombre_programa,p.descripcion);
              this.programas.push(programa);
            });
            //Determina a donde va
            loading.dismiss();
            this.alertaService.alertaBasica(this.restService.headerExito,"Se encontraron los siguientes programas",null);
            this.navCtrl.push(ProgramacionMultiRadioViewPage,{programas:this.programas});
          } else {
            loading.dismiss();
            this.alertaService.warnAlert(this.restService.headerValidacion,programacion['description'],null);
          }
        } else {
          loading.dismiss();
          this.alertaService.warnAlert(this.restService.headerValidacion,programacion['description'],null);
        }
      }, (error) => {
        loading.dismiss();
        this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError,null);
      });
  }

}
