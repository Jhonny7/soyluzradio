import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, LoadingController, ViewController, NavController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RadioPage } from '../pages/radio/radio';
import { MenuModel } from '../models/MenuModel';
import { HomePage } from '../pages/home/home';
import { MinisteriosPage } from '../pages/ministerios/ministerios';
import { AlertaServiceProvider } from '../providers/alerta-service';
import { IglesiasPage } from '../pages/iglesias/iglesias';
import { EventosPage } from '../pages/eventos/eventos';
import { RestServiceProvider } from '../providers/rest-service';
import { RadioModel } from '../models/radioModel';
import { PatrocinadorModel } from '../models/patrocinadoresModel';
import { ProgramacionModel } from '../models/programacionModel';
import { ProgramacionMultiRadioViewPage } from '../pages/programacion-multi-radio-view/programacion-multi-radio-view';
import { ProgramacionMultiRadioPage } from '../pages/programacion-multi-radio/programacion-multi-radio';
import { PatrocinadoresPage } from '../pages/patrocinadores/patrocinadores';
import { RadioMultiplePage } from '../pages/radio-multiple/radio-multiple';
import { ContactoPage } from '../pages/contacto/contacto';
import 'rxjs/add/operator/timeout';
import { Insomnia } from '@ionic-native/insomnia';
import { AcercadePage } from '../pages/acercade/acercade';
import { HttpParams } from '@angular/common/http';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Badge } from '@ionic-native/badge';
import { Storage } from '@ionic/storage';
import { MusicControls } from '@ionic-native/music-controls';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: MenuModel[] = [];

  radios: RadioModel[] = [];
  patrocinadores: PatrocinadorModel[] = [];
  public programas: ProgramacionModel[] = [];
  miaudio: any;


  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public loadingCtrl: LoadingController, public alertaService: AlertaServiceProvider,
    public restService: RestServiceProvider, private insomnia: Insomnia, public alertCtrl: AlertController,
    public fcm: FCM, public localNotifications: LocalNotifications, public datePipe: DatePipe, private badge: Badge,
    public localStorage: Storage, @Inject(DOCUMENT) private document, public musicControls: MusicControls) {
    this.initializeApp();
    this.badge.clear();
    // used for an example of ngFor and navigation
    this.pages.push(new MenuModel("Escuchar en Vivo", "radio.png", "#123", RadioPage));
    this.pages.push(new MenuModel("Directorio de Ministerios", "contacts.png", "#123", MinisteriosPage));
    this.pages.push(new MenuModel("Directorio de Iglesias", "church.png", "#123", IglesiasPage));
    this.pages.push(new MenuModel("Agenda de Eventos", "event.png", "#123", EventosPage));
    this.pages.push(new MenuModel("Horarios y Programas", "24-hours.png", "#123", RadioPage));
    this.pages.push(new MenuModel("Contacto", "mail.png", "#123", ContactoPage));
    this.pages.push(new MenuModel("Patrocinadores", "statistics.png", "#123", RadioPage));
    this.pages.push(new MenuModel("Acerca de", "acerca.png", "#123", AcercadePage));
    
    this.fcm.getToken().then(token => {
      console.log("*********************");
      console.log(token);
      console.log("*********************");
    });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.miaudio = this.document.getElementById('soy');
      console.log(this.miaudio);
      this.localStorage.ready().then(() => {
        this.localStorage.get(`@playSoyLuz`).then((data) => {
          if (data == 1) {
            this.miaudio.play();
            console.log("dando play");
            this.musicControls.create({
              isPlaying: true,
              dismissable: false,
              hasPrev: false,
              hasNext: false,
              hasSkipForward: false,
              hasSkipBackward: false,
              skipForwardInterval: 0,
              skipBackwardInterval: 0,
              hasClose: true,
              album: '',
              duration: 0,
              elapsed: 0,
              ticker: 'Ahora estas escuchando Soy Luz Radio',
              playIcon: 'media_play',
              pauseIcon: 'media_pause',
              prevIcon: 'media_prev',
              nextIcon: 'media_next',
              closeIcon: 'media_close',
              notificationIcon: 'notification'
            });
            this.musicControls.listen();                // activates the observable above
            this.musicControls.subscribe().subscribe(action => {
              console.log("suscripción");
              console.log(action);
              this.eventos(action)                      // Notificacion
            });
          } else {
            this.miaudio.pause();
            console.log("dando pause");
          }
        });
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('ios') || this.platform.is('android')) {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            //Notification was received on device tray and tapped by the user.
            console.log(JSON.stringify(data));
            var date = this.datePipe.transform(new Date(), "yyyy-MM-dd").toString();
            console.log(date);
            this.badge.increase(1);
            this.localNotifications.schedule({
              text: data.body,
              led: 'FF0000',
              //icon: 'http://www.soyluzradio.com/logo.png',
              icon: 'assets://imgs/logo.png',
              title: "Soy Luz Radio",
              vibrate: true,
              badge: 1
            });
          } else {
            //Notification was received in foreground. Maybe the user needs to be notified.
            console.log(JSON.stringify(data));
            this.alertaService.alertaBasica("Soy Luz Radio Notifica", data.body, null);
          }
        });
      } else {

      }

    });


  }

  eventos(action) {
    const message = JSON.parse(action).message;
    console.log(message);
    switch (message) {
      case 'music-controls-pause':
        this.localStorage.ready().then(() => {
          this.localStorage.set(`@playSoyLuz`, 0);//esto es lo mismo que --->  'local'+id
          this.miaudio.pause();
        });
        break;
      case 'music-controls-play':
        this.localStorage.ready().then(() => {
          this.localStorage.set(`@playSoyLuz`, 1);//esto es lo mismo que --->  'local'+id
          this.miaudio.play();
        });
        break;
      case 'music-controls-destroy':
        this.localStorage.ready().then(() => {
          this.localStorage.set(`@playSoyLuz`, 0);//esto es lo mismo que --->  'local'+id
          this.miaudio.pause();
        });
        // Do something
        break;
      case 'music-controls-toggle-play-pause':
        // Do something
        break;
      case 'music-controls-seek-to':
        // Do something
        break;
      case 'music-controls-media-button':
        // Do something
        break;
      case 'music-controls-headset-unplugged':
        // Do something
        break;
      case 'music-controls-headset-plugged':
        // Do something
        break;
      default:
        break;
    }
  }



  openPage(pagina) {
    if (pagina.nombre == "Horarios y Programas") {
      let loading = this.loadingCtrl.create();
      this.radios = [];
      loading.present();

      let params = new HttpParams(); // create params object
      var form = new FormData();
      //form.append("calle", this.iglesia.calle);//
      this.restService.restServicePOST("v1/getRadios", form).timeout(this.restService.timeOver).subscribe(
        datoPais => {
          if (datoPais['status'] == "A") {
            if (datoPais['parameters'].length > 0) {
              let array = datoPais['parameters'];
              array.forEach(r => {
                var radio = new RadioModel(r.id, r.nombre, r.path, r.fecha_alta, r.imagen, r.frase);
                this.radios.push(radio);
              });
              //Determina a donde va
              if (this.radios.length <= 1) {
                var form = new FormData();
                form.append("id", this.radios[0].id.toString());//
                this.restService.restServicePOST("programacion/getProgramacionByIdRadio", form).timeout(this.restService.timeOver).subscribe(
                  programacion => {
                    if (programacion['status'] == "A") {
                      if (programacion['parameters'].length > 0) {
                        let array = programacion['parameters'];
                        this.programas = [];
                        array.forEach(p => {
                          var programa = new ProgramacionModel(p.id, p.id_radio, p.imagen, p.nombre_programa, p.descripcion, p.hora_inicio, p.hora_termino, p.nombre_director, p.apellido_paterno_director, p.apellido_materno_director, p.dia_inicio, p.dia_termino);
                          this.programas.push(programa);
                        });
                        //Determina a donde va
                        loading.dismiss();
                        this.alertaService.alertaBasica(this.restService.headerExito, "Se encontraron los siguientes programas", null);
                        this.nav.setRoot(ProgramacionMultiRadioViewPage, { programas: this.programas });
                      } else {
                        loading.dismiss();
                        this.alertaService.warnAlert(this.restService.headerValidacion, programacion['description'], null);
                      }
                    } else {
                      loading.dismiss();
                      this.alertaService.warnAlert(this.restService.headerValidacion, programacion['description'], null);
                    }
                  }, (error) => {
                    loading.dismiss();
                    this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
                  });

              } else {
                loading.dismiss();
                this.nav.setRoot(ProgramacionMultiRadioPage, { radios: this.radios });
              }
            } else {
              loading.dismiss();
              this.alertaService.warnAlert(this.restService.headerValidacion, datoPais['description'], null);
            }
          } else {
            loading.dismiss();
            this.alertaService.warnAlert(this.restService.headerValidacion, datoPais['description'], null);
          }
        }, (error) => {
          loading.dismiss();
          this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
        });
    } else if (pagina.nombre == "Patrocinadores") {
      this.patrocinadores = [];
      let loading = this.loadingCtrl.create();

      loading.present();
      let params = new HttpParams();
      var form = new FormData();
      //form.append("calle", this.iglesia.calle);//
      this.restService.restServicePOST("patrocinadores/getPatrocinadores", form).timeout(this.restService.timeOver).subscribe(
        datoPais => {
          if (datoPais['status'] == "A") {
            if (datoPais['parameters'].length > 0) {
              let array = datoPais['parameters'];
              array.forEach(r => {
                var patrocinador = new PatrocinadorModel(r.id, r.nombre, r.imagen, r.pagina_web, r.fecha_alta);
                this.patrocinadores.push(patrocinador);
              });
              //Determina a donde va
              loading.dismiss();
              this.nav.setRoot(PatrocinadoresPage, { patrocinadores: this.patrocinadores });
            } else {
              loading.dismiss();
              this.alertaService.warnAlert(this.restService.headerValidacion, datoPais['description'], null);
            }
          } else {
            loading.dismiss();
            this.alertaService.warnAlert(this.restService.headerValidacion, datoPais['description'], null);
          }
        }, (error) => {
          loading.dismiss();
          this.alertaService.errorAlert(this.restService.headerError, this.restService.mensajeError, null);
        });
    } else if (pagina.nombre == "Escuchar en Vivo") {
      this.radios = [];
      let loading = this.loadingCtrl.create();

      loading.present();
      let params = new HttpParams();
      var form = new FormData();
      //form.append("calle", this.iglesia.calle);//
      this.restService.restServicePOST("v1/getRadios", form).timeout(this.restService.timeOver).subscribe(
        datoPais => {
          if (datoPais['status'] == "A") {
            if (datoPais['parameters'].length > 0) {
              let array = datoPais['parameters'];
              array.forEach(r => {
                var radio = new RadioModel(r.id, r.nombre, r.path, r.fecha_alta, r.imagen, r.frase);
                this.radios.push(radio);
              });
              //Determina a donde va
              loading.dismiss();
              if (this.radios.length <= 1) {
                this.nav.setRoot(RadioPage);
              } else {
                this.nav.setRoot(RadioMultiplePage, { radios: this.radios });
              }
            } else {
              loading.dismiss();
              this.nav.setRoot(RadioPage);
            }
          } else {
            loading.dismiss();
            this.nav.setRoot(RadioPage);
          }
        }, (error) => {
          loading.dismiss();
          this.nav.setRoot(RadioPage);
        });
    } else {
      this.nav.setRoot(pagina.component);
    }

  }

  exitApp() {
    const confirm = this.alertCtrl.create({
      title: "Confirmación",
      message: "¿Estás seguro de querer salir?",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {

          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.salir();
          }
        }
      ]
    });
    confirm.present();
  }

  salir() {
    this.platform.exitApp();
  }
}
