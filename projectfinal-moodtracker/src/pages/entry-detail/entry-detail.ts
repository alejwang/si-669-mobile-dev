import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Entry, Mood, Location } from '../../models/models';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service'
import { LocationDataServiceProvider } from "../../providers/location-data-service/location-data-service";

import { CurrentPage } from '../current/current';
import { LocationListPage } from '../location-list/location-list'


@IonicPage()
@Component({
  selector: 'page-entry-detail',
  templateUrl: 'entry-detail.html'
})

export class EntryDetailPage {

  private entry: Entry;
  public currentLocation: Location;
  public currentLocationAddress: string;
  private happy = new Mood("happy", 100, "/assets/imgs/happy.png", "#F0CF75", "#FFE7A3");
  private angry = new Mood("angry", 10, "/assets/imgs/angry.png", "#E6646E", "#E6888D");
  private sad = new Mood("sad", 20, "/assets/imgs/sad.png", "#6DBEFF", "#B7DDFF");
  private okay = new Mood("okay",50, "/assets/imgs/okay.png", "#F09C4F", "#F0B077");
  private happyselected = true;
  private angryselected = false;
  private sadselected = false;
  private okayselected = false;

  constructor(public navCtrl: NavController,
              public navParams:NavParams,
              private entryDataService: EntryDataServiceProvider,
              private locationService: LocationDataServiceProvider,
              private toastCtrl: ToastController) {
    // console.log(this.currentLocation.name);
    this.locationService.getObservable().subscribe(
      (update) => {
        this.currentLocation = this.locationService.getCurrentLocation();
        console.log('this.currentLocation', this.currentLocation);
      },
      (err) => {
        console.log('this.locationService.getObservable().subscribe :', err);
      });


    let entryID = this.navParams.get("entryID");

    if (entryID === undefined) {
      this.currentLocation = this.locationService.getCurrentLocation();

      this.entry = new Entry();
      this.entry.id = -1;
      this.entry.text = "";
      this.entry.mood = "happy";
      // this.entry.image = "/assets/imgs/happy_selected.png";
      this.entry.location = "";
      this.entry.timestamp = new Date();
    }else {
      this.entry = this.entryDataService.getEntryByID(entryID);
      this.currentLocationAddress = this.entry.location;

      if (this.entry.mood.type == 'happy') {
        this.happyselected = true;
        this.angryselected = false;
        this.sadselected = false;
        this.okayselected = false;
      }
      if (this.entry.mood.type == 'angry') {
        this.happyselected = false;
        this.angryselected = true;
        this.sadselected = false;
        this.okayselected = false;
      }
      if (this.entry.mood.type == 'sad') {
        this.happyselected = false;
        this.angryselected = false;
        this.sadselected = true;
        this.okayselected = false;
      }
      if (this.entry.mood.type == 'okay') {
        this.happyselected = false;
        this.angryselected = false;
        this.sadselected = false;
        this.okayselected = true;
      }
    }
  }

  private changeMood(name: string){
    this.entry.mood = name;
    if (name == 'happy') {
      this.happyselected = true;
      this.angryselected = false;
      this.sadselected = false;
      this.okayselected = false;
    }
    if (name == 'angry') {
      this.happyselected = false;
      this.angryselected = true;
      this.sadselected = false;
      this.okayselected = false;
    }
    if (name == 'sad') {
      this.happyselected = false;
      this.angryselected = false;
      this.sadselected = true;
      this.okayselected = false;
    }
    if (name == 'okay') {
      this.happyselected = false;
      this.angryselected = false;
      this.sadselected = false;
      this.okayselected = true;
    }
    // console.log(this.unselected);
  }

  private saveEntry() {
    ///save

    let entryID = this.navParams.get("entryID");

    if (entryID === undefined) {
      let newEntry = new Entry();
      let newMood = this.happy;
      if (this.entry.mood == "happy") newMood = this.happy;
      if (this.entry.mood == "angry") newMood = this.angry;
      if (this.entry.mood == "sad") newMood = this.sad;
      if (this.entry.mood == "okay") newMood = this.okay;
      newEntry.mood = newMood;
      newEntry.location = this.currentLocation.name;
      newEntry.locationId = this.currentLocation.googleMapId;
      newEntry.text = this.entry.text;
      console.log("Now I would save the entry: ", newEntry);
      this.entryDataService.addEntry(newEntry);

      let toast = this.toastCtrl.create({
        message: 'A mood record was added successfully',
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
      this.locationService.updateLocationCount(this.currentLocation);

    } else {
      if (this.entry.mood == "happy") this.entry.mood = this.happy;
      if (this.entry.mood == "angry") this.entry.mood = this.angry;
      if (this.entry.mood == "sad") this.entry.mood = this.sad;
      if (this.entry.mood == "okay") this.entry.mood = this.okay;
      this.entryDataService.updateEntry(entryID, this.entry);

      let toast = this.toastCtrl.create({
        message: 'A mood record was updated successfully',
        duration: 3000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();

    }

    this.navCtrl.pop();
    // this.navCtrl.push(CurrentPage);
  }

  private cancel() {
    this.navCtrl.pop();
  }

  private chooseCurrentLocation() {
    this.navCtrl.push(LocationListPage)
  }

}
