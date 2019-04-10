import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Entry, Location } from '../../models/models';
import { ToastController } from 'ionic-angular';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';


@IonicPage()
@Component({
  selector: 'page-new-location',
  templateUrl: 'new-location.html',
})
export class NewLocationPage {

  private entry: Entry;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private entryDataService: EntryDataServiceProvider) {
      this.entry = new Entry();
      this.entry.id = -1;
      this.entry.text = "";
      this.entry.mood = "happy";
      this.entry.location = "";
      this.entry.timestamp = new Date();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewLocationPage');
  }


  private saveEntry() {
    ///present toast
    let toast = this.toastCtrl.create({
      message: 'A mood record was added successfully',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();

    ///save
    let newEntry = new Entry();
    // newEntry.mood = this.entry.mood;
    newEntry.location = this.entry.location;
    newEntry.text = this.entry.text;
    console.log("Now I would save the entry: ", newEntry);
    this.entryDataService.addEntry(this.entry);
    this.navCtrl.popToRoot();
    this.navCtrl.parent.select(1);
  }

}
