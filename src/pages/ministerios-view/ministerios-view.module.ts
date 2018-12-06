import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinisteriosViewPage } from './ministerios-view';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MinisteriosViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MinisteriosViewPage),
    PipesModule
  ],
})
export class MinisteriosViewPageModule {}
