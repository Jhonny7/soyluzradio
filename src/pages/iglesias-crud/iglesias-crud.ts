import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { IglesiaModel } from '../../models/iglesiaModel';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { PaisModel } from '../../models/paisModel';
import { EstadoModel } from '../../models/estadoModel';
import { MunicipioModel } from '../../models/municipioModel';
import { RestServiceProvider } from '../../providers/rest-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import 'rxjs/add/operator/timeout';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-iglesias-crud',
  templateUrl: 'iglesias-crud.html',
})
export class IglesiasCrudPage {

  public iglesia: IglesiaModel = new IglesiaModel();

  public paises: PaisModel[] = [];
  public estados: EstadoModel[] = [];
  public municipios: MunicipioModel[] = [];
  public idPais: Number = 0;
  public idEstado: Number = 0;

  public s: boolean = false;
  public w: boolean = false;
  public n: boolean = false;
  public base64Image: any = null;

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, public alertaService: AlertaServiceProvider,
    public loadingCtrl: LoadingController, public restService: RestServiceProvider,private camera: Camera,public iap: InAppBrowser) {
    this.paises = navParams.get('paises');
    this.idEstado = 0;
    this.estados.push(new EstadoModel(0, "[--Seleccione Estado--]"));
    this.iglesia.idMunicipio = 0;
    this.municipios.push(new MunicipioModel(0, "[--Seleccione Municipio--]"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IglesiasCrudPage');
  }

  dismiss() {
    console.log("close");
    this.viewCtrl.dismiss();
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

  validarCampos() {
    let camposRequeridos = "Campo(s) Requerido(s) ";
    let errores = 0;
    if (this.iglesia.calle == null || this.iglesia.calle.length <= 0) {
      camposRequeridos += ", Calle";
      errores++;
    }
    if (this.iglesia.numeroExterior == null || this.iglesia.numeroExterior.length <= 0) {
      camposRequeridos += ", Número Exterior";
      errores++;
    }
    if (this.iglesia.colonia == null || this.iglesia.colonia.length <= 0) {
      camposRequeridos += ", Colonia";
      errores++;
    }
    if (this.iglesia.codigoPostal == null || this.iglesia.codigoPostal.length <= 0) {
      camposRequeridos += ", Código Postal";
      errores++;
    }
    if (this.iglesia.idMunicipio == 0) {
      camposRequeridos += ", Municipio";
      errores++;
    }
    if (this.iglesia.nombreIglesia == null || this.iglesia.nombreIglesia.length <= 0) {
      camposRequeridos += ", Nombre de la Iglesia";
      errores++;
    }
    if (this.iglesia.denominacion == null || this.iglesia.denominacion.length <= 0) {
      camposRequeridos += ", Denominación";
      errores++;
    }
    if (this.iglesia.telefono == null || this.iglesia.telefono.length <= 0) {
      camposRequeridos += ", Teléfono";
      errores++;
    }
    if (this.iglesia.nombrePastor == null || this.iglesia.nombrePastor.length <= 0) {
      camposRequeridos += ", Nombre del Pastor ó Encargado";
      errores++;
    }
    if (this.iglesia.apellidoPaternoPastor == null || this.iglesia.apellidoPaternoPastor.length <= 0) {
      camposRequeridos += ", Apellido Paterno del Pastor ó Encargado";
      errores++;
    }
    if (errores > 0) {
      this.alertaService.warnAlert(this.restService.headerValidacion, camposRequeridos, null);
      return false;
    } else {
      return true;
    }
  }

  enviar() {
    if (this.validarCampos()) {
      let suscripcionWhatsapp = 0;
      let suscripcionBoletins = 0;
      let recibirNotificaciones = 0;
      if (this.w) {
        suscripcionWhatsapp = 1;
      } else {
        suscripcionWhatsapp = 0;
      }
      if (this.s) {
        suscripcionBoletins = 1;
      } else {
        suscripcionBoletins = 0;
      }
      if (this.n) {
        recibirNotificaciones = 1;
      } else {
        recibirNotificaciones = 0;
      }
      //Petición
      let loading = this.loadingCtrl.create();
      loading.present();
      var form = new FormData();
      form.append("calle", this.iglesia.calle);//
      form.append("numeroExterior", this.iglesia.numeroExterior);//
      if (this.iglesia.numeroInterior.length > 0) {
        form.append("numeroInterior", this.iglesia.numeroInterior);
      }
      form.append("colonia", this.iglesia.colonia);//
      form.append("codigoPostal", this.iglesia.codigoPostal);//
      form.append("idMunicipio", this.iglesia.idMunicipio.toString());//
      form.append("nombreIglesia", this.iglesia.nombreIglesia);//
      form.append("denominacion", this.iglesia.denominacion);//
      form.append("telefono", this.iglesia.telefono);//
      if (this.iglesia.email.length > 0) {
        form.append("email", this.iglesia.email);
      }
      if (this.iglesia.invitacionHorarios.length > 0) {
        form.append("invitacionHorarios", this.iglesia.invitacionHorarios);
      }
      form.append("nombreEncargado", this.iglesia.nombrePastor);//
      form.append("apellidoPaternoEncargado", this.iglesia.apellidoPaternoPastor);//

      if (this.iglesia.apellidoMaternoPastor.length > 0) {
        form.append("apellidoMaternoEncargado", this.iglesia.apellidoMaternoPastor);
      }
      form.append("suscripcionMinuto", suscripcionWhatsapp.toString());
      form.append("suscripcionBoletin", suscripcionBoletins.toString());
      form.append("notificar", recibirNotificaciones.toString());
      if (this.base64Image !== null) {
        form.append("imagen", this.base64Image);
      }
      //Rest
      this.restService.restServicePOST("iglesias/createIglesia", form).timeout(this.restService.timeOver).subscribe(data => {
        console.log(data);
        if (data != null) {
          if (data['status'] == "A") {
            loading.dismiss();
            this.viewCtrl.dismiss();//no envio datos de retorno
            this.alertaService.alertaBasica(this.restService.headerExito, "Se ha creado su iglesia, puede buscarla por su zona", null);
          } else {
            this.alertaService.warnAlert(this.restService.headerValidacion, data['description'], null);
            loading.dismiss();
          }
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al crear su iglesia en nuestra base de datos", null);
          loading.dismiss();
        }
      }, error => {
        console.log(error);
        this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
        loading.dismiss();
      });
    }
  }

  tomarFoto() {

    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }

    this.camera.getPicture(options).then(imageData => {
      //data:image/jpeg;base64,
      this.base64Image = `${imageData}`;
      console.log(this.base64Image);
    }).catch(error =>{
      console.error( error );
    });

  }

  seleccionarFoto() {

    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then(imageData => {
      this.base64Image = `${imageData}`;
    }).catch(error =>{
      console.error( error );
    });
  }

  borrarImagen(){ 
    if(this.base64Image == null){
      this.alertaService.warnAlert(this.restService.headerValidacion,"No ha capturado o seleccionado una imagen",null);
    }else{
      this.base64Image = null;
      this.alertaService.alertaBasica(this.restService.headerExito,"Tu imagen ha sido borrada",null);
    }
  }

  pagar(){
    this.iap.create('http://soyluzradio.com/pagoiglesias.html',"_self");
  }
}
