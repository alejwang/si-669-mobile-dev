import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Entry } from '../../models/entry';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';


@IonicPage()
@Component({
  selector: 'page-entry-detail',
  templateUrl: 'entry-detail.html',
})
export class EntryDetailPage {

  private entry: Entry;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private entryDataService: EntryDataServiceProvider) {
      let entryID = this.navParams.get("entryID");
      if (entryID === undefined) {
        this.entry = new Entry();
        this.entry.title = "";
        this.entry.text = "";
        this.entry.timestamp = new Date();
        this.entry.id = -1; // placeholder for 'temporary' entry
      } else {
        this.entry = this.entryDataService.getEntryByID(entryID);
      }
      console.log("entry is ", this.entry);
    }


  private saveEntry() {
    if (this.entry.id === -1) { 
      this.entryDataService.addEntry(this.entry);
    } else {
      // prompt for timestamp
      let newTS = new Date();
      let oldTS = new Date(this.entry.timestamp);
      let alert = this.alertCtrl.create({
        title: "Update timestamp?",
        subTitle: "Do you want to keep the original timestamp for this entry, \
                   or update to the current time?",
        inputs: [
          {
            name: "original",
            type: "radio",
            value: "original",
            label: "Keep (" + oldTS.toLocaleString() + ")",
            checked: true
          },
          {
            name: "updated",
            type: "radio",
            value: "updated",
            label: "Update (" + newTS.toLocaleString() + ")",
            checked: false
          }
        ],
        buttons: [
          {  
            text:  "Cancel",
            role: "cancel"
          },
          {
            text: "OK",
            handler: data => {
              if (data === "original") {
                 this.entry.timestamp = oldTS;
              } else {
                this.entry.timestamp = newTS;
                console.log("Updating entry. New entry is:" , this.entry);
              }
              this.entryDataService.updateEntry(this.entry.id, this.entry);
            }
          } 
        ]
      });
      alert.present();
    }
    this.navCtrl.pop();
  }

  private cancel() {
    this.navCtrl.pop();
  }

}
