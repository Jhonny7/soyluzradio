import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { RadioModel } from '../../models/radioModel';
import { RestServiceProvider } from '../../providers/rest-service';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { ProgramacionModel } from '../../models/programacionModel';
import { ProgramacionMultiRadioPage } from '../programacion-multi-radio/programacion-multi-radio';
import { ProgramacionMultiRadioInfoPage } from '../programacion-multi-radio-info/programacion-multi-radio-info';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-programacion-multi-radio-view',
  templateUrl: 'programacion-multi-radio-view.html',
})
export class ProgramacionMultiRadioViewPage {

  public programas:ProgramacionModel[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public restService: RestServiceProvider,
    public alertaService: AlertaServiceProvider, public loadingCtrl: LoadingController, public modalController: ModalController) {
    this.programas = navParams.get('programas');
  }

  ionViewDidLoad() {
  }

  clickPrograma(programa:ProgramacionModel){
    let modal = this.modalController.create(ProgramacionMultiRadioInfoPage, {programa});
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        //this.todoService.editar(todo,data); editar directamente desde el servicio
      }
    });
  }

}
