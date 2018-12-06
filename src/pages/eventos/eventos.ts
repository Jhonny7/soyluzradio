import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { PaisModel } from '../../models/paisModel';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { RestServiceProvider } from '../../providers/rest-service';
import { EstadoModel } from '../../models/estadoModel';
import { MunicipioModel } from '../../models/municipioModel';
import { EventosCrudPage } from '../eventos-crud/eventos-crud';
import { EventosViewPage } from '../eventos-view/eventos-view';
import 'rxjs/add/operator/timeout';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-eventos',
  templateUrl: 'eventos.html',
})
export class EventosPage {
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
    public loadingCtrl: LoadingController, public modalController: ModalController) {
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
    let modal = this.modalController.create(EventosCrudPage, { paises: this.paises });
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
      this.alertaService.errorAlert(this.restService.headerExito, this.restService.mensajeError, null);
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
    this.restService.restServicePOST("eventos/getEventosSearch", form).timeout(this.restService.timeOver).subscribe(data => {
      console.log(data);
      if (data != null) {
        if (data['status'] == "A") {
          loading.dismiss();
          this.alertaService.alertaBasica("Exitoso", "Se han encontrado los siguientes registros", null);
          let iglesias = data['parameters'];
          console.log(iglesias);
          this.navCtrl.push(EventosViewPage,{eventos:iglesias});
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
    this.restService.restServicePOST("eventos/ultimosEventos", form).timeout(this.restService.timeOver).subscribe(data => {
      console.log(data);
      if (data != null) {
        if (data['status'] == "A") {
          loading.dismiss();
          this.alertaService.alertaBasica(this.restService.headerExito, "Se han encontrado los siguientes registros", null);
          let iglesias = data['parameters'];
          console.log(iglesias);
          this.navCtrl.push(EventosViewPage,{eventos:iglesias,bandera:1});
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, data['description'], null);
          loading.dismiss();
        }
      } else {
        this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al buscar eventos en nuestra base de datos", null);
        loading.dismiss();
      }
    }, error => {
      this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
      loading.dismiss();
    });
  }
}
