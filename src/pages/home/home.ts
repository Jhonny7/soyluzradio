import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController } from 'ionic-angular';
import { MenuModel } from '../../models/MenuModel';
import { RadioPage } from '../radio/radio';
import { MinisteriosPage } from '../ministerios/ministerios';
import { IglesiasPage } from '../iglesias/iglesias';
import { EventosPage } from '../eventos/eventos';
import { RestServiceProvider } from '../../providers/rest-service';
import { AlertaServiceProvider } from '../../providers/alerta-service';
import { RadioModel } from '../../models/radioModel';
import { ProgramacionMultiRadioPage } from '../programacion-multi-radio/programacion-multi-radio';
import { RadioMultiplePage } from '../radio-multiple/radio-multiple';
import { ProgramacionModel } from '../../models/programacionModel';
import { ProgramacionMultiRadioViewPage } from '../programacion-multi-radio-view/programacion-multi-radio-view';
import { PatrocinadorModel } from '../../models/patrocinadoresModel';
import { PatrocinadoresPage } from '../patrocinadores/patrocinadores';
import { ContactoPage } from '../contacto/contacto';
import 'rxjs/add/operator/timeout';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AcercadePage } from '../acercade/acercade';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pages: MenuModel[] = [];
  radios: RadioModel[] = [];
  patrocinadores: PatrocinadorModel[] = [];
  public programas: ProgramacionModel[] = [];
  constructor(public navCtrl: NavController, public restService: RestServiceProvider,
    public alertaService: AlertaServiceProvider, public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController, public socialSharing: SocialSharing) {
    this.pages.push(new MenuModel("Escuchar en Vivo", "radio.png", "#000", RadioPage));
    this.pages.push(new MenuModel("Directorio de Ministerios", "contacts.png", "#000", MinisteriosPage));
    this.pages.push(new MenuModel("Directorio de Iglesias", "church.png", "#000", IglesiasPage));
    this.pages.push(new MenuModel("Agenda de Eventos", "event.png", "#000", EventosPage));
    this.pages.push(new MenuModel("Horarios y Programas", "24-hours.png", "#000", RadioPage));
    this.pages.push(new MenuModel("Contacto", "mail.png", "#000", ContactoPage));
    this.pages.push(new MenuModel("Patrocinadores", "statistics.png", "#000", RadioPage));
    this.pages.push(new MenuModel("Acerca de", "acerca.png", "#000", AcercadePage));
  }

  public irA(pagina: any) {
    if (pagina.nombre == "Horarios y Programas") {
      let loading = this.loadingCtrl.create();
      this.radios = [];
      loading.present();
      let params = new HttpParams();
      var form = new FormData();
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
                          var programa = new ProgramacionModel(p.id, p.id_radio, p.imagen, p.nombre_programa, p.descripcion, p.hora_inicio, p.hora_termino, p.nombre_director, p.apellido_paterno_director, p.apellido_materno_director,p.dia_inicio,p.dia_termino);
                          this.programas.push(programa);
                        });
                        //Determina a donde va
                        loading.dismiss();
                        this.alertaService.alertaBasica("Exitoso!", "Se encontraron los siguientes programas", null);
                        this.navCtrl.push(ProgramacionMultiRadioViewPage, { programas: this.programas });
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
                this.navCtrl.push(ProgramacionMultiRadioPage, { radios: this.radios });
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
              this.navCtrl.push(PatrocinadoresPage, { patrocinadores: this.patrocinadores });
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
                this.navCtrl.push(RadioPage);
              } else {
                this.navCtrl.push(RadioMultiplePage, { radios: this.radios });
              }
            } else {
              loading.dismiss();
              this.navCtrl.push(RadioPage);
            }
          } else {
            loading.dismiss();
            this.navCtrl.push(RadioPage);
          }
        }, (error) => {
          loading.dismiss();
          this.navCtrl.push(RadioPage);
        });
    } else {
      this.navCtrl.push(pagina.component);
    }
  }

  presentPopover(myEvent) {
    /*let popover = this.popoverCtrl.create(CompartirPage);
    popover.present({
      ev: myEvent
    });*/
  }


  shared() {
    var img = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAQDAwMDAwQDAwQFBAMEBQcFBAQFBwgGBgcGBggKCAgICAgICggKCgsKCgg';
    img += 'NDQ4ODQ0SEhISEhQUFBQUFBQUFBT/2wBDAQUFBQgHCA8KCg8SDwwPEhYVFRUVFhYUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAAR';
    img += 'CACKANADAREAAhEBAxEB/8QAHQAAAgMBAQEBAQAAAAAAAAAABQYABAcDCAIJAf/EAEAQAAEDAwIEAwUFBgUDBQAAAAIBAwQABREGEgcTITEUIkEyUWFxgQgVI0KRJ';
    img += 'DNigrHRFkNSoeFTcsE0RMLw8f/EABwBAAIDAQEBAQAAAAAAAAAAAAQFAAMGAgEHCP/EAD8RAAEDAgQEAwUGBAUEAwAAAAEAAgMEEQUSITEGE0FRImFxFDJCgZEHFSO';
    img += 'hsdEzUsHwFkNicpIkU2PhVLLC/9oADAMBAAIRAxEAPwD8/wCoopUUUqKKVFFKii/uFXtUUXQY8g/ZaNfotWCJ52BXJeB1Vlu0XJ32Ix1c2imd8JVZqIx1V5nSV7e7MY+';
    img += 'dEswipd0VDsQhHVEWeH16c9rA/Si2cPVDkO7F4Qr7PDSYX713HySjWcMPO5QrsdYNgjFu4Rvz3RYj81501wiCmf6UT/hmNou5yp+/HH3QiUrgrJgP+GmMPtuomcbVWrG';
    img += 'cPUzhcOVb8ambuFwPg6WMiL6fyrXR4YhOzlwMff1CHSuENxaRSDmoPxH/AIoV/C3ZyIZj46hApPDu7M+ySL9KDfw1ONii2Y1E5DXtIXlr/KQqEfgVS3oim4lC7qqLtju';
    img += 'jXtRy+lCOw2ob8KvbVRnqqpw5Tftsmn0od1PI3dpVokaeq4qJD3RU+dVEELu6/leKKVFFKiilRRSoopUUTlA4a6gmkgly2c+pZ/tWgbw1WHolEmNQM8082r7OOo7gKGUtt';
    img += 'BX/AEj/AM17/h6ZvvJbJxVANgrlx+zVqC3Mq+jivinfb3qyPA2dXKhvFkZNiLJTc4bFBPZLbNFTvnNNIuG4u90YMaz+6ils0jZWiTnx0JPfijmcPU46ISfEZjsU/WzRGm';
    img += 'JjaI3HBD+FXfdEcewSObFahp1KuucN44JmOwKp6dKvZFGOi4Zi7ndVXHSJMLtVjH0okMZ0Vntt1eY044n+X/tXQsqzU3TTpjRsKS5Jud6Lw9htbBSrg9jqjbfXCe8i7Invo';
    img += 'HFK9lFAZD0TDB6KXEqplPFq55t/f9UxXXh9Cu1htk+JGas+pJ8E7q1pzmK7KW2b9rMgkwm3ePXH/wBRHgPEntBDJrNe7UDyWj4n4VNCXvpiZIIyGOfaw5ltWj0VvTVvd0';
    img += '5Z7Tc3JhWeKjzwXA2wjuSlcMmm45kw+im5G3mrbit9QUxL0oDjCrkjmYGSWZ1t8rfLp8034BooKqKXPDzJdMubNYAZi4AjQP0zNzaODSFwiX2/y48y3FIcisW3Sz9zgSW';
    img += 'AZT8SFZ4Ujk9W18oumpKnuNaxMeI1LW5GvLQGXFvJrf7+a+nVWA4c6QSviY9z5w12a+zppG336j/6hWtV3m+aZ1E9DhTHrhHjXFY6w3gjkRx4AwyP2Wx87oyHFNfVcdsV';
    img += 'dLi1ZG/SRx1/S363QtBw5hdVThzoGNJZe4voXmTz2aWi3ZDrLf519uun7HNleJanq+3LbVsPxufCbWPlRBMbHEIk+dFYXjVSaqIPkJBOvzCD4k4WoIsNqpYoWtc1oLbdM';
    img += 'rzmtr1GnyQWBw7aenPTdQvhaNPRJAjLmyci2KOGgCmfiq19QxDFYaSLO4r4VguG1OIz8qFpc7XT01K7az0DCFb9bI9u+7NQ6aeQn4qHzm5Nue6x5jR4TKEipux2ylJMD4';
    img += 'gdVTPhlFnDbzHQrX4/w22hpYaqB2eKQanYtePeaR+ixl+EOeoJ+la8sCyTJELkW5he7Y/pVDqdh6Ipkzu6EyLRELOWkoV9BC7ojGVLu6FP2GCX+WlAyYPAeiKZWPQ93Tk';
    img += 'T8qYoGTAYeiJbWuVJzTwJ7BLQL8Ab0KubWFVDsTo9ioR+BvGxVwqgq5WqSnbrQjsKlC79oaua22Wn5M1Q6gmHRdc5q9dHa2m/ZXrX2UvK+ZgqzbrxPsriFFdVBTuC9R/S';
    img += 'h5LSe8FxLSskWk6c4l2SXti3oEjuL05ncFpPVYU46xm6T1FHNHt4gm6ZoPSWrY/NY5RKadHGsLSps81OdUEyqc06Gx7FZjqbgNOhb5Fr/FaTrgf7U5pcWjdo5MosYc3R6z0';
    img += '7FdrI/tdbNohX3U+jcx401R3tMcwTdYb4qbWpze5O26qJ6MO1aldRT9WrSLXZLVfQHk7VcX8vrSKdz4d0PFVua7K9G2uHO1f3eR+VBmvC0MEd/RU9YaObi2rS+l9uyPq7V';
    img += 'tvt9w+MVsldcH6qiVkeJ60ziOLoXC/ovqn2dUwppKmrHvQwPc3/AHHT91Rl3e5FG1lq61OpE1RrDXjGhbNOwhFBt0UkFEaReg5EcLisxzXDM9ps9z8gPYL6CKSJxgppRmgg';
    img += 'pTUPb/O93fukLiRqbUcnjb/gz7yVqzwL7Ht9vwxHMo6O8plx1ve2WHCzuVffQ1fVzSVOVztjp5J3w7hNHBg3PZGA58Zc7UjNuQDY7DYeSdtU6CuNj0fqrUVtvl3jx9PDc7c';
    img += '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';
    img += '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';
    
    this.socialSharing.shareViaWhatsApp("¡Sintoniza la radio que nació para brillar!, Que esperas? Descargala Ahora!",null,"https://play.google.com/store/apps/details?id=mx.com.fares.soyluzradio")
    .then((data)=>{
      console.log(data);
    }).catch((error) => {
      console.log("error");
      console.log(error);
    });
    //shareViaWhatsApp(message, image, url)
  }
}
