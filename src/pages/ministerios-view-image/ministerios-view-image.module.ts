import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinisteriosViewImagePage } from './ministerios-view-image';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MinisteriosViewImagePage,
  ],
  imports: [
    IonicPageModule.forChild(MinisteriosViewImagePage),
    PipesModule
  ],
})
export class MinisteriosViewImagePageModule {} 
