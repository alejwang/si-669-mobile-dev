import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EntryDetailPage } from '../entry-detail/entry-detail';
import { Entry } from '../../models/entry';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private entries: Entry[] = [];

  constructor(public navCtrl: NavController, 
      private entryService: EntryDataServiceProvider) {
    this.entryService.getObservable().subscribe(() => {
      this.entries = entryService.getEntries();
      for (let e of this.entries) {
        if (typeof e.timestamp === 'string') {
          e.timestamp = new Date(e.timestamp);
        }
      }
      this.entries.sort((a:Entry, b:Entry) => {
        return (a.timestamp.getTime() - b.timestamp.getTime());
      }).reverse();
      console.log(this.entries);
    });
    
    this.entries = entryService.getEntries();
  }



  private addEntry() {
    this.navCtrl.push(EntryDetailPage);
  }

  private editEntry(entryID: number) {
    console.log("editing entry ", entryID);
    this.navCtrl.push(EntryDetailPage, {"entryID": entryID});
  }

  private deleteEntry(entryID: number) {
    console.log("deleting entry", entryID);
    this.entryService.removeEntry(entryID);
  }
}
