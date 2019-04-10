import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewMoodPage } from './new-mood';

@NgModule({
  declarations: [
    NewMoodPage,
  ],
  imports: [
    IonicPageModule.forChild(NewMoodPage),
  ],
})
export class NewMoodPageModule {}
