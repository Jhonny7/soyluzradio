import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { MinisterioModel } from '../../models/ministerioModel';
import { CategoriaMinisterioModel } from '../../models/categoriaMinisterioModel';
import { PaisModel } from '../../models/paisModel';
import { EstadoModel } from '../../models/estadoModel';
import { RestServiceProvider } from '../../providers/rest-service';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { MunicipioModel } from '../../models/municipioModel';
import { Camera, CameraOptions } from '@ionic-native/camera';
import 'rxjs/add/operator/timeout';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-ministerios-crud',
  templateUrl: 'ministerios-crud.html',
})
export class MinisteriosCrudPage {
  public ministerio: MinisterioModel = new MinisterioModel();
  public categorias: CategoriaMinisterioModel[] = [];
  public paises: PaisModel[] = [];
  public estados: EstadoModel[] = [];
  public municipios: MunicipioModel[] = [];
  public idPais: Number = 0;
  public idEstado: Number = 0;

  public s: boolean = false;
  public w: boolean = false;

  public base64Image:any = null;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams,
    public restService: RestServiceProvider, public alertaService: AlertaServiceProvider,
    public loadingCtrl: LoadingController, private camera: Camera,public iap: InAppBrowser) {
    this.categorias = navParams.get('categorias');
    this.paises = navParams.get('paises');
    console.log(this.categorias);
    console.log(this.ministerio);
    this.ministerio.idCategoria = 0;
    this.idEstado = 0;
    this.estados.push(new EstadoModel(0, "[--Seleccione Estado--]"));
    this.ministerio.idMunicipio = 0;
    this.municipios.push(new MunicipioModel(0, "[--Seleccione Municipio--]"));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinisteriosCrudPage');
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
    console.log("**********************"+id.toString());
    let params = new HttpParams();
    params = params.append('idPais',id);
    var form = new FormData();
    form.append("idPais", id);//
    this.restService.restServicePOST("asentamientos/getEstados", form).timeout(this.restService.timeOver).subscribe(data => {
      console.log(data);
      if (data != null) {
        if (data['parameters']!=null && data['parameters'].length > 0) {
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
    if (this.ministerio.nombreMinisterio == null) {
      camposRequeridos += ", Nombre de Ministerio";
      errores++;
    }
    if (this.ministerio.idCategoria == 0) {
      camposRequeridos += ", Categoría";
      errores++;
    }
    if (this.ministerio.idMunicipio == 0) {
      camposRequeridos += ", Municipio";
      errores++;
    }
    if (this.ministerio.telefono == null || this.ministerio.telefono.length <= 0) {
      camposRequeridos += ", Teléfono";
      errores++;
    }
    if (this.ministerio.email == null || this.ministerio.email.length <= 0) {
      camposRequeridos += ", Email";
      errores++;
    }
    if (this.ministerio.nombreDirector == null || this.ministerio.nombreDirector.length <= 0) {
      camposRequeridos += ", Nombre del Director";
      errores++;
    }
    if (this.ministerio.apellidoPaternoDirector == null || this.ministerio.apellidoPaternoDirector.length <= 0) {
      camposRequeridos += ", Apellido Paterno";
      errores++;
    }
    if (errores > 0) {
      this.alertaService.warnAlert("Advertencia", camposRequeridos, null);
      return false;
    } else {
      return true;
    }
  }

  enviar() {
    if (this.validarCampos()) {
      let suscripcionWhatsapp = 0;
      let suscripcionBoletins = 0;
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
      //Petición
      let loading = this.loadingCtrl.create();

      loading.present();

      var form = new FormData();
      form.append("nombreMinisterio", this.ministerio.nombreMinisterio);
      form.append("idCategoria", this.ministerio.idCategoria.toString());
      form.append("idMunicipio", this.ministerio.idMunicipio.toString());
      form.append("telefono", this.ministerio.telefono);
      form.append("facebook", this.ministerio.facebook);
      form.append("email", this.ministerio.email);
      form.append("descripcion", this.ministerio.descripcion);
      form.append("nombreDirector", this.ministerio.nombreDirector);
      form.append("apellidoPaternoDirector", this.ministerio.apellidoPaternoDirector);
      form.append("apellidoMaternoDirector", this.ministerio.apellidoMaternoDirector);
      form.append("suscripcionMinuto", suscripcionWhatsapp.toString());
      form.append("suscripcionBoletin", suscripcionBoletins.toString());
      if(this.base64Image !== null){
        form.append("imagen", this.base64Image);
      }
      //Rest
      this.restService.restServicePOST("ministerios/createMinisterio", form).timeout(this.restService.timeOver).subscribe(data => {
        console.log(data);
        if (data != null) {
          if (data['status'] == "A") {
            loading.dismiss();
            this.viewCtrl.dismiss();//no envio datos de retorno
            this.alertaService.alertaBasica(this.restService.headerExito, "Se ha creado su ministerio, puede visualizarlo en el apartado correspondiente", null);
          } else {
            this.alertaService.warnAlert(this.restService.headerValidacion, data['description'], null);
            loading.dismiss();
          }
        } else {
          this.alertaService.warnAlert(this.restService.headerValidacion, "Ha ocurrido un error al crear su ministerio en nuestra base de datos", null);
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
    this.iap.create('http://soyluzradio.com/pagoministerios.html',"_self");
  }

}
