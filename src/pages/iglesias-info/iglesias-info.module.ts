import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IglesiasInfoPage } from './iglesias-info';

@NgModule({
  declarations: [
    IglesiasInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(IglesiasInfoPage),
  ],
})
export class IglesiasInfoPageModule {}
