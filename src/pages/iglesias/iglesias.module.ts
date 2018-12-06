import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IglesiasPage } from './iglesias';

@NgModule({
  declarations: [
    IglesiasPage,
  ],
  imports: [
    IonicPageModule.forChild(IglesiasPage),
  ],
})
export class IglesiasPageModule {}
