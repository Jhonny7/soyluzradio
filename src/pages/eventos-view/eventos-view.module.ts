import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventosViewPage } from './eventos-view';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    EventosViewPage,
  ],
  imports: [
    IonicPageModule.forChild(EventosViewPage),
    PipesModule
  ],
})
export class EventosViewPageModule {}
