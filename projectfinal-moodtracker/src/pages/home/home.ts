import { Component, AnimationStyles } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EntryDetailPage } from '../entry-detail/entry-detail';
import { CurrentPage } from '../current/current';
import { ChartPage } from '../chart/chart';
import { NewMoodPage } from '../new-mood/new-mood';

import { Entry } from '../../models/models';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';
import { LocationDataServiceProvider } from "../../providers/location-data-service/location-data-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private entries: Entry[];

  constructor(public navCtrl: NavController,
              private entryService: EntryDataServiceProvider,
              private locationService: LocationDataServiceProvider) {
    this.entryService.getObservable().subscribe(
      (update) => {
          this.entries = this.entryService.getEntries();
          console.log(this.entries);
      },
      (err) => {
        console.log('this.entryService.getObservable().subscribe :', err);
      });
    this.entries = this.entryService.getEntries();
  }

  private editEntry(entryID: any) {
    // console.log("editing entry ", entryID);
    this.navCtrl.push(EntryDetailPage, {"entryID": entryID});
  }

  // private getMood(name: string) {
  //   let thisMood = this.entryService.getMood(name)
  //   // console.log('thisMood', thisMood);
  //   return thisMood;
  // }

  private deleteEntry(entryID: any) {
    let thisMood = this.entryService.removeEntry(entryID);
    // console.log('thisMood', thisMood);
    return thisMood;
  }

  private checkStatus() {
    if(this.entryService.getEntries().length == 0){
        return true;
      }
      return false;
  }
  //
  // // add the first or new record
  // private addNew() {
  //   this.locationService.getCurrentGeolocation();
  //   this.navCtrl.push(EntryDetailPage);
  // }

  private checkLength() {
    let k: any;
    for (k in this.entries){
      var entry = this.entries[k];
      if(entry.location.length > 20){
        return true;
      }
      return false;
    }

  }


}
