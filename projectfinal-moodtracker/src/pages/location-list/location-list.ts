import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Location } from '../../models/models';
import { LocationDataServiceProvider } from '../../providers/location-data-service/location-data-service';

import { LocationListNewPage } from "../location-list-new/location-list-new";

@IonicPage()
@Component({
  selector: 'page-location-list',
  templateUrl: 'location-list.html',
})
export class LocationListPage {

  private popularLocations: Location[];
  private nearbyLocations: Location[];
  private currentLocation: Location;
  private loadMoreText:string = 'Load More';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationService: LocationDataServiceProvider) {
    this.locationService.getObservable().subscribe(
      (update) => {
        this.nearbyLocations = this.locationService.getNearbyLocations();
        this.popularLocations = this.locationService.getPopularLocations();
        this.currentLocation = this.locationService.getCurrentLocation();
      },
      (err) => {
        console.log('this.locationService.getObservable().subscribe :', err);
      });
    this.nearbyLocations = this.locationService.getNearbyLocations();
    this.popularLocations = this.locationService.getPopularLocations();
    this.currentLocation = this.locationService.getCurrentLocation();
  }

  private chooseLocation(location: Location){
    this.locationService.updateCurrentLocationByUser(location);
    this.navCtrl.pop();
  }

  private createNewLocation() {
    this.navCtrl.push(LocationListNewPage);
  }

  private initLocationsFromGoogle() {
    this.loadMoreText = 'No more'
    // this.locationService.initLocationsFromGoogle();
  }

}
