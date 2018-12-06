import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventosMapPage } from './eventos-map';

@NgModule({
  declarations: [
    EventosMapPage,
  ],
  imports: [
    IonicPageModule.forChild(EventosMapPage),
  ],
})
export class EventosMapPageModule {}
