import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import leaflet from 'leaflet';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import 'rxjs/add/operator/timeout';
import { RestServiceProvider } from '../../providers/rest-service';

@IonicPage()
@Component({
  selector: 'page-eventos-map',
  templateUrl: 'eventos-map.html',
})
export class EventosMapPage {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  iglesia: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertaService: AlertaServiceProvider, public restService:RestServiceProvider) {
    this.iglesia = navParams.get('evento');
  }

  ionViewDidLoad() { 
    this.loadmap();
  }

  loadmap() {

    this.map = leaflet.map('map2').setView([this.iglesia.latitud, this.iglesia.longitud], 25);
    // set map tiles source
    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Localización del evento &copy; <a href="https://www.soyluzradio.com/">Soy Luz Radio</a>',
      maxZoom: 20,
    }).addTo(this.map);

    this.map.locate({
      setView: true,
      maxZoom: 30
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
    }).on('locationerror', (err) => {
      this.alertaService.errorAlert(this.restService.headerValidacion, "Habilita los permisos de geolocalización en ajustes", null);
    })

}
}
