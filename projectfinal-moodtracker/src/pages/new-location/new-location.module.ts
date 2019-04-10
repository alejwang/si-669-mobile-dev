import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewLocationPage } from './new-location';

@NgModule({
  declarations: [
    NewLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(NewLocationPage),
  ],
})
export class NewLocationPageModule {}
