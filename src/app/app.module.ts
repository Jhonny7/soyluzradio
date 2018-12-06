import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RadioPageModule } from '../pages/radio/radio.module';
import { HomePage } from '../pages/home/home';
import { MinisteriosPageModule } from '../pages/ministerios/ministerios.module';
import { RestServiceProvider } from '../providers/rest-service';
import { HttpClientModule } from '@angular/common/http';
import { AlertaServiceProvider } from '../providers/alerta-service';
import { MinisteriosCrudPageModule } from '../pages/ministerios-crud/ministerios-crud.module';
import { MinisteriosViewPageModule } from '../pages/ministerios-view/ministerios-view.module';
import { AsentamientoService } from '../providers/asentamiento-service';
import {NgxMaskModule} from 'ngx-mask';
import { PipesModule } from '../pipes/pipes.module';
import { MinisteriosInfoPageModule } from '../pages/ministerios-info/ministerios-info.module';
import { MinisteriosViewImagePage } from '../pages/ministerios-view-image/ministerios-view-image';
import { MinisteriosViewImagePageModule } from '../pages/ministerios-view-image/ministerios-view-image.module';
import { Camera } from '@ionic-native/camera';
import { IglesiasPageModule } from '../pages/iglesias/iglesias.module';
import { IglesiasCrudPageModule } from '../pages/iglesias-crud/iglesias-crud.module';
import { IglesiasInfoPageModule } from '../pages/iglesias-info/iglesias-info.module';
import { IglesiasViewPageModule } from '../pages/iglesias-view/iglesias-view.module';
import { IglesiasMapPageModule } from '../pages/iglesias-map/iglesias-map.module';
import { EventosPageModule } from '../pages/eventos/eventos.module';
import { EventosCrudPageModule } from '../pages/eventos-crud/eventos-crud.module';
import { EventosInfoPageModule } from '../pages/eventos-info/eventos-info.module';
import { EventosViewPageModule } from '../pages/eventos-view/eventos-view.module';
import { EventosMapPageModule } from '../pages/eventos-map/eventos-map.module';
import { DatePipe } from '@angular/common';
import { ProgramacionMultiRadioPage } from '../pages/programacion-multi-radio/programacion-multi-radio';
import { ProgramacionMultiRadioInfoPage } from '../pages/programacion-multi-radio-info/programacion-multi-radio-info';
import { ProgramacionMultiRadioViewPage } from '../pages/programacion-multi-radio-view/programacion-multi-radio-view';
import { RadioMultipleViewPageModule } from '../pages/radio-multiple-view/radio-multiple-view.module';
import { RadioMultiplePageModule } from '../pages/radio-multiple/radio-multiple.module';
import { ProgramacionMultiRadioViewPageModule } from '../pages/programacion-multi-radio-view/programacion-multi-radio-view.module';
import { ProgramacionMultiRadioInfoPageModule } from '../pages/programacion-multi-radio-info/programacion-multi-radio-info.module';
import { ProgramacionMultiRadioPageModule } from '../pages/programacion-multi-radio/programacion-multi-radio.module';
import { PatrocinadoresPageModule } from '../pages/patrocinadores/patrocinadores.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ContactoPageModule } from '../pages/contacto/contacto.module';
import { Insomnia } from '@ionic-native/insomnia';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AcercadePageModule } from '../pages/acercade/acercade.module';
import { AppVersion } from '@ionic-native/app-version';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { MinisteriosPopoverPageModule } from '../pages/ministerios-popover/ministerios-popover.module';
import { IglesiasPopoverPageModule } from '../pages/iglesias-popover/iglesias-popover.module';
import { IglesiasMapIndicationsPageModule } from '../pages/iglesias-map-indications/iglesias-map-indications.module';
import { Geolocation } from '@ionic-native/geolocation';

import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Badge } from '@ionic-native/badge';
import { IonicStorageModule } from '@ionic/storage';
import { MusicControls } from '@ionic-native/music-controls';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    RadioPageModule,
    MinisteriosPageModule,
    HttpClientModule,
    MinisteriosCrudPageModule,
    MinisteriosViewPageModule,
    MinisteriosInfoPageModule,
    MinisteriosViewImagePageModule, 
    NgxMaskModule.forRoot(),
    PipesModule,
    IglesiasPageModule,
    IglesiasCrudPageModule,
    IglesiasInfoPageModule,
    IglesiasViewPageModule,
    IglesiasMapPageModule,
    EventosPageModule,
    EventosCrudPageModule,
    EventosInfoPageModule,
    EventosViewPageModule,
    EventosMapPageModule,
    ProgramacionMultiRadioPageModule,
    ProgramacionMultiRadioInfoPageModule,
    ProgramacionMultiRadioViewPageModule,
    RadioMultipleViewPageModule,
    RadioMultiplePageModule,
    PatrocinadoresPageModule,
    ContactoPageModule,
    AcercadePageModule,
    MinisteriosPopoverPageModule,
    IglesiasPopoverPageModule,
    IglesiasMapIndicationsPageModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestServiceProvider,
    AlertaServiceProvider,
    AsentamientoService,
    Camera,
    DatePipe,
    InAppBrowser,
    Insomnia,
    SocialSharing,
    AppVersion,
    Uid,
    AndroidPermissions,
    Geolocation,
    FCM,
    LocalNotifications,
    Badge,
    MusicControls
  ]
})
export class AppModule {}
