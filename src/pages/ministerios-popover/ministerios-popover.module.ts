import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinisteriosPopoverPage } from './ministerios-popover';

@NgModule({
  declarations: [
    MinisteriosPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(MinisteriosPopoverPage),
  ],
})
export class MinisteriosPopoverPageModule {}
