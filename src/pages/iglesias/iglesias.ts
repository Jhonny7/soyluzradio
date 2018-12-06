import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, PopoverController } from 'ionic-angular';
import { IglesiasCrudPage } from '../iglesias-crud/iglesias-crud';
import { PaisModel } from '../../models/paisModel';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { RestServiceProvider } from '../../providers/rest-service';
import { EstadoModel } from '../../models/estadoModel';
import { MunicipioModel } from '../../models/municipioModel';
import { IglesiasViewPage } from '../iglesias-view/iglesias-view';
import 'rxjs/add/operator/timeout';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IglesiasPopoverPage } from '../iglesias-popover/iglesias-popover';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-iglesias',
  templateUrl: 'iglesias.html',
})
export class IglesiasPage {

  public paises: PaisModel[] = [];
  public estados: EstadoModel[] = [];
  public municipios: MunicipioModel[] = [];
  public idPais: Number = 0;
  public idEstado: Number = 0;
  public idMunicipio: Number = 0;
  public nombre: string = "";
  public nombreEncargado: string = "";
  public denominacion: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public restService: RestServiceProvider, public alertaService: AlertaServiceProvider,
    public loadingCtrl: LoadingController, public modalController: ModalController,
    public iap: InAppBrowser, public popoverCtrl: PopoverController) {
    this.idEstado = 0;
    this.estados.push(new EstadoModel(0, "[--Seleccione Estado--]"));
    this.idMunicipio = 0;
    this.municipios.push(new MunicipioModel(0, "[--Seleccione Municipio--]"));
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();

    loading.present();
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
  }

  crearIglesia() {
    let modal = this.modalController.create(IglesiasCrudPage, { paises: this.paises });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        //this.todoService.editar(todo,data); editar directamente desde el servicio
      }
    });
  }

  onChangePais(id) {
    this.estados = [];
    let loading = this.loadingCtrl.create();

    loading.present();
    var config = {
      timeout: 5000,
      params: {
        idPais: id
      }
    }
    let params = new HttpParams();
    params = params.append('idPais',id);
    var form = new FormData();
    form.append("idPais", id);//
    this.restService.restServicePOST("asentamientos/getEstados", form).timeout(this.restService.timeOver).subscribe(data => {
      console.log(data);
      if (data != null) {
        if (data['parameters'].length > 0) {
          var parametros = data['parameters'];
          parametros.forEach(estado => {
            this.estados.push(new EstadoModel(estado.id, estado.nombre, estado.id_pais));
          });
          loading.dismiss();
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, "No hay registros en el servidor", null);
          loading.dismiss();
        }
      } else {
        this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al consultar los estados", null);
        loading.dismiss();
      }
    }, error => {
      console.log(error);
      this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
      loading.dismiss();
    });
  }

  onChangeEstado(id) {
    this.municipios = [];
    let loading = this.loadingCtrl.create();

    loading.present();
    var config = {
      timeout: 5000,
      params: {
        idEntidad: id
      }
    }
    let params = new HttpParams();
    params = params.append('idEntidad',id);
    var form = new FormData();
    form.append("idEntidad", id);//
    this.restService.restServicePOST("asentamientos/getMunicipios", form).timeout(this.restService.timeOver).subscribe(data => {
      console.log(data);
      if (data != null) {
        if (data['parameters'].length > 0) {
          var parametros = data['parameters'];
          parametros.forEach(municipio => {
            this.municipios.push(new MunicipioModel(municipio.id, municipio.nombre, municipio.id_entidad));
          });
          loading.dismiss();
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, "No hay registros en el servidor", null);
          loading.dismiss();
        }
      } else {
        this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al consultar los municipios", null);
        loading.dismiss();
      }
    }, error => {
      console.log(error);
      this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
      loading.dismiss();
    });
  }

  buscar() {
    let loading = this.loadingCtrl.create();

    loading.present();

    var form = new FormData();
    form.append("idMunicipio", this.idMunicipio.toString());
    form.append("nombre", this.nombre);
    form.append("nombreEncargado", this.nombreEncargado);
    form.append("denominacion", this.denominacion);
    form.append("idEntidad", this.idEstado.toString());

    //Rest
    this.restService.restServicePOST("iglesias/getIglesiasSearch", form).timeout(this.restService.timeOver).subscribe(data => {
      console.log(data);
      if (data != null) {
        if (data['status'] == "A") {
          loading.dismiss();
          this.alertaService.alertaBasica(this.restService.headerExito, "Se han encontrado los siguientes registros", null);
          let iglesias = data['parameters'];
          console.log(iglesias);
          this.navCtrl.push(IglesiasViewPage,{iglesias});
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, data['description'], null);
          loading.dismiss();
        }
      } else {
        this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al buscar iglesias en nuestra base de datos", null);
        loading.dismiss();
      }
    }, error => {
      this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
      loading.dismiss();
    });
  }

  ultimas(){
    let loading = this.loadingCtrl.create();

    loading.present();

    var form = new FormData();

    //Rest
    this.restService.restServicePOST("iglesias/ultimasIglesias", form).timeout(this.restService.timeOver).subscribe(data => {
      console.log(data);
      if (data != null) {
        if (data['status'] == "A") {
          loading.dismiss();
          this.alertaService.alertaBasica(this.restService.headerExito, "Se han encontrado los siguientes registros", null);
          let iglesias = data['parameters'];
          console.log(iglesias);
          this.navCtrl.push(IglesiasViewPage,{iglesias,bandera:1});
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, data['description'], null);
          loading.dismiss();
        }
      } else {
        this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al buscar iglesias en nuestra base de datos", null);
        loading.dismiss();
      }
    }, error => {
      this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
      loading.dismiss();
    });
  }
  
  openPopOver(myEvent){
    let popover = this.popoverCtrl.create(IglesiasPopoverPage);
    popover.present({
      ev: myEvent
    });
  }
}
