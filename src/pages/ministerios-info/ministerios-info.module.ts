import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinisteriosInfoPage } from './ministerios-info';

@NgModule({
  declarations: [
    MinisteriosInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MinisteriosInfoPage),
  ],
})
export class MinisteriosInfoPageModule {}
