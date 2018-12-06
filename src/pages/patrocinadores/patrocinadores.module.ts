import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrocinadoresPage } from './patrocinadores';

@NgModule({
  declarations: [
    PatrocinadoresPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrocinadoresPage),
  ],
})
export class PatrocinadoresPageModule {}
