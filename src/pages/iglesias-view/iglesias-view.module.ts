import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IglesiasViewPage } from './iglesias-view';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    IglesiasViewPage,
  ],
  imports: [
    IonicPageModule.forChild(IglesiasViewPage),
    PipesModule
  ],
})
export class IglesiasViewPageModule {}
