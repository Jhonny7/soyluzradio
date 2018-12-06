import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventosCrudPage } from './eventos-crud';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    EventosCrudPage,
  ],
  imports: [
    IonicPageModule.forChild(EventosCrudPage),
    NgxMaskModule.forRoot()
  ],
})
export class EventosCrudPageModule {}
