import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewLocationPage } from '../new-location/new-location';
import { Entry } from '../../models/models';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';

@IonicPage()
@Component({
  selector: 'page-new-mood',
  templateUrl: 'new-mood.html',
})
export class NewMoodPage {
  private entry: Entry;
  private currentTime = new Date();


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private entryDataService: EntryDataServiceProvider) {
      this.entry = new Entry();
      this.entry.id = -1;
      this.entry.text = "";
      this.entry.mood = "happy";
      this.entry.location = "";
      this.entry.timestamp = new Date();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewMoodPage');
  }

  private changeMood(name: string){
    // this.buttonColor = "blue";
    this.entry.mood = name;
  }


  private saveEntry() {
    ///save
    let newEntry = new Entry();
    newEntry.id = this.entry.id;
    newEntry.timestamp = this.entry.timestamp;
    newEntry.mood = this.entry.mood;
    // newEntry.location = this.entry.location;
    // newEntry.text = this.entry.text;
    console.log("Now I would save the mood: ", newEntry.mood);
    this.entryDataService.addEntry(this.entry);
    // this.navCtrl.pop();
    this.navCtrl.push(NewLocationPage);
  }


}
