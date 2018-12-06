import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IglesiasPopoverPage } from './iglesias-popover';

@NgModule({
  declarations: [
    IglesiasPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(IglesiasPopoverPage),
  ],
})
export class IglesiasPopoverPageModule {}
