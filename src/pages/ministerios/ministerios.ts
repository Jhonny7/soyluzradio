import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, PopoverController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service';
import { CategoriaMinisterioModel } from '../../models/categoriaMinisterioModel';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { MinisteriosViewPage } from '../ministerios-view/ministerios-view';
import { MinisteriosCrudPage } from '../ministerios-crud/ministerios-crud';
import { PaisModel } from '../../models/paisModel';
import { MinisterioModel } from '../../models/ministerioModel';
import 'rxjs/add/operator/timeout';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MinisteriosPopoverPage } from '../ministerios-popover/ministerios-popover';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-ministerios',
  templateUrl: 'ministerios.html',
})
export class MinisteriosPage {

  public categoriasMinisterios: CategoriaMinisterioModel[] = [];
  public categoriasMinisteriosModal: CategoriaMinisterioModel[] = [];
  public paises: PaisModel[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public restService: RestServiceProvider, public alertaService: AlertaServiceProvider,
    public loadingCtrl: LoadingController, public modalController: ModalController,
    public iap: InAppBrowser, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();

    loading.present();
    let params = new HttpParams();
    var form = new FormData();
    this.restService.restServicePOST("ministerios/getCategoriaMinisterios", form).timeout(this.restService.timeOver).subscribe(
      data => { // Success
        if (data['status'] == "A") {
          if (data['parameters'].length > 0) {
            let parametros = data['parameters'];
            parametros.forEach(p => {
              let categoria = null;
              console.log(p);
              if (p.id !== 0) {
                categoria = new CategoriaMinisterioModel(p.id, p.nombre, p.descripcion, p.fecha_alta, p.icono);
                this.categoriasMinisterios.push(categoria);
                this.categoriasMinisteriosModal.push(categoria);
              } else {
                categoria = new CategoriaMinisterioModel(p.id, p.nombre, p.descripcion, p.fecha_alta, p.icono);
                this.categoriasMinisteriosModal.push(categoria);
              }

            });
            let params = new HttpParams();
            var form = new FormData();
            this.restService.restServicePOST("asentamientos/getPaises", form).timeout(this.restService.timeOver).subscribe(
              datoPais => {
                if (datoPais['status'] == "A") {
                  if (datoPais['parameters'].length > 0) {
                    let array = datoPais['parameters'];
                    array.forEach(pais => {
                      var paisNuevo = new PaisModel(pais.id, pais.nombre);
                      this.paises.push(paisNuevo);
                    });
                    loading.dismiss();
                  } else {
                    this.alertaService.warnAlert(this.restService.headerValidacion, "No hay registros en el servidor", null);
                    loading.dismiss();
                  }
                } else {
                  this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al consultar los países", null);
                  loading.dismiss();
                }
              }, (error) => {
                console.error(error);
                this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
                loading.dismiss();
              });
            loading.dismiss();
          } else {
            this.alertaService.warnAlert(this.restService.headerValidacion, "No hay registros en el servidor", null);
            loading.dismiss();
          }
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al consultar los ministerios", null);
          loading.dismiss();
        }
      },
      (error) => {
        console.error(error);
        this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
        loading.dismiss();
      }
    )
  }

  crearMinisterio() {
    console.log(this.categoriasMinisterios);
    let modal = this.modalController.create(MinisteriosCrudPage, { categorias: this.categoriasMinisteriosModal, paises: this.paises });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        //this.todoService.editar(todo,data); editar directamente desde el servicio
      }
    });
  }

  clickCategoria(categoria: CategoriaMinisterioModel) {
    let loading = this.loadingCtrl.create();
    loading.present();
    //
    var config = {
      timeout: 5000,
      params: {
        idCategoria: categoria.id
      }
    }

    var form = new FormData();
    form.append("idCategoria", categoria.id.toString());
    //
    this.restService.restServicePOST("ministerios/getMinisterioPorCategoria", form).timeout(this.restService.timeOver).subscribe(
      data => {
        if (data['status'] == "A") {
          if (data['parameters'].length > 0) {
            let array = data['parameters'];
            var ministerio = array[0];
            console.log(ministerio);
            loading.dismiss();
            var a = null;
            switch (categoria.id) {
              case 1:
                a = "iconoalabanza.jpg";
                break;
              case 2:
                a = "iconoconfe.jpg";
                break;
              case 3:
                a = "iconoinfantil.jpg";
                break;
              case 4:
                a = "iconocomuni.jpg";
                break;
              case 5:
                a = "iconoayuda.jpg";
                break;
              case 6:
                a = "iconoarte.jpg";
                break;
              case 7:
                a = "iconolibrerias.jpg";
                break;
              default:
                a = "category.png";
                break;
            }

            this.navCtrl.push(MinisteriosViewPage, { ministerios: array, categoria });
          } else {
            this.alertaService.warnAlert(this.restService.headerValidacion, "No hay registros en el servidor", null);
            loading.dismiss();
          }
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, data['description'], null);
          loading.dismiss();
        }
      }, (error) => {
        console.error(error);
        this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
        loading.dismiss();
      });
  }
  
  openPopOver(myEvent){
    let popover = this.popoverCtrl.create(MinisteriosPopoverPage);
    popover.present({
      ev: myEvent
    });
  }
}
