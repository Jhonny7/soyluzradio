import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ModalController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { MinisterioModel } from '../../models/ministerioModel';
import { CategoriaMinisterioModel } from '../../models/categoriaMinisterioModel';
import { DOCUMENT } from '@angular/common';
import { MinisteriosInfoPage } from '../ministerios-info/ministerios-info';
import { MinisteriosViewImagePage } from '../ministerios-view-image/ministerios-view-image';
import 'rxjs/add/operator/timeout';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-ministerios-view',
  templateUrl: 'ministerios-view.html',
})
export class MinisteriosViewPage {
  public ministerios: any = null;
  public categoria: CategoriaMinisterioModel = null;

  public ministerio: any;

  public busqueda: any;
  public order: Number;
  public descending: boolean = false;

  public isOn: boolean = false;

  public titulo: any;
  public barra: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, @Inject(DOCUMENT) private document: any,
    public restService: RestServiceProvider, public loadingCtrl: LoadingController,
    public alertaService: AlertaServiceProvider, public modalController: ModalController) {
    //getMinisterioPorCategoria
    this.ministerios = navParams.get('ministerios');
    this.categoria = navParams.get('categoria');
    console.log(this.categoria);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinisteriosViewPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
  }

  clickMinisterio(ministerio: any) {
    let loading = this.loadingCtrl.create();
    loading.present();
    //
    var config = {
      timeout: 5000,
      params: {
        id: ministerio.id
      }
    }
    let params = new HttpParams();
    params = params.append('id',ministerio.id);
    var form = new FormData();
    form.append("id", ministerio.id);//
    this.restService.restServicePOST("ministerios/getMinisterioById", form).timeout(this.restService.timeOver).subscribe(
      datoMinisterio => {
        if (datoMinisterio['status'] == "A") {
          if (datoMinisterio['parameters'].length > 0) {
            let array = datoMinisterio['parameters'];
            this.ministerio = array[0];
            loading.dismiss();
            let modal = this.modalController.create(MinisteriosInfoPage, { ministerio:this.ministerio });
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

  clickImage(imagen:any){
    let modal = this.modalController.create(MinisteriosViewImagePage, { pathImage:imagen });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        //this.todoService.editar(todo,data); editar directamente desde el servicio
      }
    });
  }

}
