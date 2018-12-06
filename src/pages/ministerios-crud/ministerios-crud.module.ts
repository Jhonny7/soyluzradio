import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinisteriosCrudPage } from './ministerios-crud';
import {NgxMaskModule} from 'ngx-mask'
@NgModule({
  declarations: [
    MinisteriosCrudPage,
  ],
  imports: [
    IonicPageModule.forChild(MinisteriosCrudPage),
    NgxMaskModule.forRoot()
  ],
})
export class MinisteriosCrudPageModule {}
