import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationListNewPage } from './location-list-new';

@NgModule({
  declarations: [
    LocationListNewPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationListNewPage),
  ],
})
export class LocationListNewPageModule {}
