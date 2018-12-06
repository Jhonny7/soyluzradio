import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IglesiasMapPage } from './iglesias-map';

@NgModule({
  declarations: [
    IglesiasMapPage,
  ],
  imports: [
    IonicPageModule.forChild(IglesiasMapPage),
  ],
})
export class IglesiasMapPageModule {}
