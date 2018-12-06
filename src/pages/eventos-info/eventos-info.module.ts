import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventosInfoPage } from './eventos-info';

@NgModule({
  declarations: [
    EventosInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(EventosInfoPage),
  ],
})
export class EventosInfoPageModule {}
