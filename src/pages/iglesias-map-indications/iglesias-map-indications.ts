import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import leaflet from 'leaflet';
import 'leaflet-routing-machine';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import 'rxjs/add/operator/timeout';
import { RestServiceProvider } from '../../providers/rest-service';
import { Geolocation } from '@ionic-native/geolocation';

declare var L: any;


@IonicPage()
@Component({
  selector: 'page-iglesias-map-indications',
  templateUrl: 'iglesias-map-indications.html',
})
export class IglesiasMapIndicationsPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  iglesia: any;
  latitudInicial: any;
  longitudInicial: any;
  marker: any = null;
  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,
    public alertaService: AlertaServiceProvider, public restService: RestServiceProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    this.iglesia = navParams.get('iglesia');
  }

  ionViewDidLoad() {
    console.log("Se inicia la carga de vista");
    this.getPosition();
  }

  getPosition() {
    console.log("Se inicia obtener posición");
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    var opciones = {maximumAge:0, timeout: 7000, enableHighAccuracy: false}
    this.geolocation.getCurrentPosition(opciones)
      .then((resp) => {
        console.log("Se obtienen coordenadas");
        console.log(resp);
        this.latitudInicial = resp.coords.latitude;
        this.longitudInicial = resp.coords.longitude;
        console.log(resp.coords);
        this.loadmap();//carga mapa con coordenadas iniciales
      })
      .catch((error) => {
        console.log('Error getting location', error);
        this.loading.dismiss();
        const alert = this.alertCtrl.create({
          title: this.restService.headerError,
          subTitle: "Favor de revisar permisos de geolocalización en ajustes y/o su conexión a internet",
          cssClass: 'errorAlert',
          buttons: [
            {
              text: 'Regresar',
              handler: () => {
                this.navCtrl.pop();
              }
            },{
              text: 'Reintentar',
              handler: () => {
                this.getPosition();
              }
            }
          ]
        });
        alert.present();
        this.alertaService.errorAlert(this.restService.headerError, "Favor de revisar permisos de geolocalización en ajustes y/o su conexión a internet", null);
      });
  }

  loadmap() {
    console.log("Se inicia la carga de mapa");
    this.map = leaflet.map('map').setView([this.latitudInicial, this.longitudInicial], 25);
    // set map tiles source
    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Mapa de Iglesia &copy; <a href="https://www.soyluzradio.com/">Soy Luz Radio</a>',
      maxZoom: 20,
    }).addTo(this.map);

    this.map.locate({
      setView: true,
      maxZoom: 30
    }).on('locationfound', (e) => {
      // add marker to the map
      this.marker = leaflet.marker([this.latitudInicial, this.longitudInicial]).addTo(this.map);

      L.Routing.control({
        waypoints: [
          L.latLng(this.latitudInicial, this.longitudInicial),//punto inicial
          L.latLng(this.iglesia.latitud, this.iglesia.longitud)//punto final
        ]
      }).addTo(this.map);

      this.watchPosition();
    }).on('locationerror', (err) => {
      //alert(err.message);
      this.loading.dismiss();
      this.alertaService.errorAlert(this.restService.headerError, "Habilita los permisos de geolocalización en ajustes", null);
      console.log(err);
      console.log(err.message);
    })
  }

  watchPosition() {
    let options = {
      timeout: 2000 //cada 2 segundos actualizará ruta
    }
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.loading.dismiss();
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log(data);
      console.log("Actualizando posición");
        this.map.removeLayer(this.marker);
      var greenIcon = L.icon({
        iconUrl: 'assets/imgs/car.png',

        iconSize: [25, 25], // size of the icon
        iconAnchor: [11, 18], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      this.marker = leaflet.marker([data.coords.latitude, data.coords.longitude], {icon: greenIcon}).addTo(this.map);//punto final
    }, (err) => {
      this.loading.dismiss();
      console.log(err)
    });
  }
}
