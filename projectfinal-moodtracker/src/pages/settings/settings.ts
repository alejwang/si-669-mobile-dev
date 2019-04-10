import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform  } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';

import { Location } from "../../models/models";
import { LocationDataServiceProvider } from "../../providers/location-data-service/location-data-service";
import { UsersserviceProvider } from "../../providers/usersservice/usersservice";
import { LoginPage } from "../login/login";
import  * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  timeText: string;
  timeNotify: any;

  // private nearbyLocations: Location[];
  public userName: string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public alertCtrl: AlertController,
              private localNotifications: LocalNotifications,
              private locationService: LocationDataServiceProvider,
              private usersService: UsersserviceProvider,
              private entryDataService: EntryDataServiceProvider) {
    this.locationService.getObservable().subscribe(
      (update) => {
        // this.nearbyLocations = this.locationService.getNearbyLocations();
      },
      (err) => {
        console.log('this.locationService.getObservable().subscribe :', err);
      });
    // this.nearbyLocations = this.locationService.getNearbyLocations();
    this.userName = this.usersService.getProfileName();

    this.timeText = moment(new Date()).format();
    this.timeNotify = new Date().getTime() + 1000;

  }

  timeChange(time) {
    this.timeNotify = new Date();
    this.timeNotify.setHours(time.hour, time.minute, 0);
    console.log("see time" + "this.timeNotify")
  }

  onEnable() {
    this.onCancel().then(() => {
      this.localNotifications.schedule({
        id: 101,
        title: "Mood Tracker",
        text: 'How are you? It only takes a second - record your current feelings!',
        trigger: {at: this.timeNotify},
        // trigger: {at: new Date(new Date().getTime() + 1000)},
        every: 'day'
      });
      const alert = this.alertCtrl.create({
        title: 'Finished!',
        subTitle: 'Notification has been set successfully.',
        buttons: ['OK']
      });
      alert.present();
      console.log('Notification has been set successfully...');
    });
  }

  onCancel() {

    return this.platform.ready().then(() => {
      // const alert = this.alertCtrl.create({
      //   title: 'Finished!',
      //   subTitle: 'Notification has been cancelled.',
      //   buttons: ['OK']
      // });
      // alert.present();
      return this.localNotifications.cancelAll();
    })
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  dev_switchAccount() {
    this.usersService.signout();
    this.navCtrl.setRoot(LoginPage);
  }

  dev_delAccount() {

  }

  dev_initLocations() {
    const confirm = this.alertCtrl.create({
      title: 'Initialize Database?',
      message: 'It will overwrite the default locations, but will not affect user-generated locations.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Initialize Database Cancelled');
          }
        },
        {
          text: 'Overwrite',
          handler: () => {
            this.locationService.dev_initLocations();
            const alert = this.alertCtrl.create({
              title: 'Finished!',
              subTitle: 'Location database already reset.',
              buttons: ['OK']
            });
            alert.present();
          }
        }
      ]
    });
    confirm.present();
  }



  dev_testNotification() {
    console.log(new Date());
    console.log(new Date(new Date().getTime() + 360000));
    this.localNotifications.schedule({
      title: "Mood Tracker",
      text: 'How are you? It only takes a second - record your current feelings!'

    });
  }


  dev_testGPS() {
    let currentLocation = this.locationService.getCurrentGeolocation();
    if (currentLocation === 'unknown') {
      const alert = this.alertCtrl.create({
        title: "Can't Find your location!",
        subTitle: "Please check your privacy settings",
        buttons: ['OK']
      });
      alert.present();
    } else {
      const alert = this.alertCtrl.create({
        title: 'Find your location!',
        subTitle: "Lat: " + currentLocation.lat + " <br> Long: " + currentLocation.lng,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  dev_fakeGeolocation() {
    this.locationService.dev_fakeGeolocation();
    const alert = this.alertCtrl.create({
      title: 'Fake your GPS Data!',
      subTitle: 'Please relaunch to reset',
      buttons: ['OK']
    });
    alert.present();
  }

}
