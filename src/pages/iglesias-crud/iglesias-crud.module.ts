import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IglesiasCrudPage } from './iglesias-crud';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    IglesiasCrudPage,
  ],
  imports: [
    IonicPageModule.forChild(IglesiasCrudPage),
    NgxMaskModule.forRoot()
  ],
})
export class IglesiasCrudPageModule {}
