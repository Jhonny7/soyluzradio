import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrocinadoresInfoPage } from './patrocinadores-info';

@NgModule({
  declarations: [
    PatrocinadoresInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrocinadoresInfoPage),
  ],
})
export class PatrocinadoresInfoPageModule {}
