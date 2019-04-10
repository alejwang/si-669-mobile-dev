import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Location } from '../../models/models';
import { LocationDataServiceProvider } from '../../providers/location-data-service/location-data-service';

@IonicPage()
@Component({
  selector: 'page-location-list-new',
  templateUrl: 'location-list-new.html',
})

export class LocationListNewPage {

  public placeName: string = "";
  public placeAddress: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private locationService: LocationDataServiceProvider) {
  }

  public createPlace(): void {
    if (this.placeName === '') {
      const alert = this.alertCtrl.create({
        title: 'Please input the name',
        subTitle: 'Try to think a name for here!',
        buttons: ['OK']
      });
      alert.present();
      return undefined
    }
    let currentGeolocation = this.locationService.getCurrentGeolocation();
    let currentLocation = this.locationService.getCurrentLocation();
    if (currentLocation.lat == 999) {
      const alert = this.alertCtrl.create({
        title: 'No GPS signal',
        subTitle: 'Please try again later.',
        buttons: ['OK']
      });
      alert.present();
      return undefined
    }
    if (this.placeAddress === '') {
      this.placeAddress = 'In ' + currentLocation.name;
    }
    let location = new Location(this.placeName, this.placeAddress, currentGeolocation.lat, currentGeolocation.lng, 0, 'userdefined-'+ this.placeName + '-' + this.placeAddress);
    this.locationService.addLocation(location);
    this.locationService.updateCurrentLocationByUser(location);
    this.navCtrl.pop();
    this.navCtrl.pop();
  }


}
