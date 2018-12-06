import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ModalController } from 'ionic-angular';
import { DOCUMENT } from '@angular/common';
import { RestServiceProvider } from '../../providers/rest-service';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { IglesiasInfoPage } from '../iglesias-info/iglesias-info';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-iglesias-view',
  templateUrl: 'iglesias-view.html',
})
export class IglesiasViewPage {
  public iglesias: any = null;

  public iglesia: any;

  public busqueda: any;
  public order: Number;
  public descending: boolean = false;

  public isOn: boolean = false;
  public titulo: any;
  public barra: any;
  public bandera:any;
  public mensaje:String;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, @Inject(DOCUMENT) private document: any,
    public restService: RestServiceProvider, public loadingCtrl: LoadingController,
    public alertaService: AlertaServiceProvider, public modalController: ModalController) {
      this.iglesias = navParams.get('iglesias');
      this.bandera = navParams.get('bandera');
      if(this.bandera == null){
        this.mensaje="IGLESIAS EN MI ZONA";
      }else{
        this.mensaje="IGLESIAS AÑADIDAS RECIENTEMENTE";
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IglesiasViewPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
  }

  sort() {
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  toggleDetails() {
    this.isOn = !this.isOn;
    if (!this.isOn) {
      this.barra = this.document.getElementById('barra');
      this.titulo = this.document.getElementById('titulo');
      if (this.barra != null) {
        this.barra.classList.remove("fadeInDown");
        this.barra.classList.add("fadeIn");
      }
      if (this.titulo != null) {
        this.titulo.classList.remove("fadeIn");
        this.titulo.classList.add("fadeInDown");
      }

    } else {
      this.barra = this.document.getElementById('barra');
      this.titulo = this.document.getElementById('titulo');
      if (this.barra != null) {
        this.barra.classList.remove("fadeIn");
        this.barra.classList.add("fadeInDown");
      }
      if (this.titulo != null) {
        this.titulo.classList.remove("fadeInDown");
        this.titulo.classList.add("fadeIn");
      }
    }
  }

  clickIglesia(iglesia: any) {
    let loading = this.loadingCtrl.create();
    loading.present();
    //
    var form = new FormData();
    form.append("id", iglesia.id.toString());
    this.restService.restServicePOST("iglesias/getIglesiaById", form).timeout(this.restService.timeOver).subscribe(
      datoMinisterio => {
        if (datoMinisterio['status'] == "A") {
          if (datoMinisterio['parameters'].length > 0) {
            let array = datoMinisterio['parameters'];
            this.iglesia = array[0];
            loading.dismiss();
            let modal = this.modalController.create(IglesiasInfoPage, { iglesia:this.iglesia });
            modal.present();
            modal.onDidDismiss((data) => {
              if (data) {
                //this.todoService.editar(todo,data); editar directamente desde el servicio
              }
            });
          } else {
            this.alertaService.warnAlert(this.restService.headerValidacion, "No hay registros en el servidor", null);
            loading.dismiss();
          }
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, datoMinisterio['description'], null);
          loading.dismiss();
        }
      }, (error) => {
        console.error(error);
        this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
        loading.dismiss();
      });
  }

}
