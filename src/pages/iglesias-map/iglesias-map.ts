import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import leaflet from 'leaflet';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import 'rxjs/add/operator/timeout';
import { RestServiceProvider } from '../../providers/rest-service';

@IonicPage()
@Component({
  selector: 'page-iglesias-map',
  templateUrl: 'iglesias-map.html',
})
export class IglesiasMapPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  iglesia: any;
  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    public alertaService: AlertaServiceProvider, public restService:RestServiceProvider) {
    this.iglesia = navParams.get('iglesia');
  }

  ionViewDidLoad() {
    this.loadmap();
  }

  loadmap() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.map = leaflet.map('map').setView([this.iglesia.latitud, this.iglesia.longitud], 15);
    // set map tiles source
    leaflet.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
      attribution: 'Mapa de Iglesia &copy; <a href="https://www.soyluzradio.com/">Soy Luz Radio</a>',
      maxZoom: 20,
    }).addTo(this.map);
 
    

    this.map.locate({
      setView: true,
      maxZoom: 15
    }).on('locationfound', (e) => {
      // add marker to the map
      let marker = leaflet.marker([this.iglesia.latitud, this.iglesia.longitud]).addTo(this.map);
      // add popup to the marker
      var infoWindowContent = '<div id="content" style="width: 210px;">';
      infoWindowContent += '<center><strong><h1 id="firstHeading" class="firstHeading" style="font-size: 100%;">';
      infoWindowContent += this.iglesia.nombre + '</h1></strong>';
      infoWindowContent += '<p><strong>Domicilio: </strong>' + this.iglesia.direccion + '</p>';
      if (this.iglesia.ruta_imagen !== null) {
        infoWindowContent += '<img src="'+this.iglesia.ruta_imagen+'" alt="logo" style="width: 88%;"/></center></div>';
      } else if (this.iglesia.base_64 !== null) {
        infoWindowContent += '<img src="data:image/jpeg;base64,'+this.iglesia.base_64+'" alt="logo" style="width: 88%;"/></center></div>';
      } else {
        infoWindowContent += '<img src="assets/imgs/church.jpg" alt="logo" style="width: 88%;"/></center></div>';
      }
      marker.bindPopup(infoWindowContent).openPopup();
      this.loading.dismiss();
    }).on('locationerror', (err) => {
      console.log(err.message);
      console.log(err);
      this.loading.dismiss();
      this.alertaService.errorAlert(this.restService.headerError, "Habilita los permisos de geolocalización en ajustes", null);
    })


  }

}
