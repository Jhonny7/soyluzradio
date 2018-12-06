import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinisteriosPage } from './ministerios';

@NgModule({
  declarations: [
    MinisteriosPage,
  ],
  imports: [
    IonicPageModule.forChild(MinisteriosPage),
  ],
})
export class MinisteriosPageModule {}
