import { Injectable } from '@angular/core';
import { Location } from '../../models/models';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import firebase from 'firebase';
// import '../../assets/js/place.js';
import { Default_locations }  from '../../assets/cache/default_locations.js';
// import { HttpClient } from "@angular/common/http";
import { Geolocation } from '@ionic-native/geolocation';
import { RestProvider } from "../rest/rest";
// import 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC9ICYAY0GONi1mgiGgRjAAuaev2qqosvM&libraries=places&callback=initMap'

// const config = {
//   apiKey: "AIzaSyC9ICYAY0GONi1mgiGgRjAAuaev2qqosvM",
//   authDomain: "mood-tracker-8f5b8.firebaseapp.com",
//   databaseURL: "https://mood-tracker-8f5b8.firebaseio.com",
//   projectId: "mood-tracker-8f5b8",
//   storageBucket: "mood-tracker-8f5b8.appspot.com",
//   messagingSenderId: "1047636349755"
// };



@Injectable()
export class LocationDataServiceProvider {
  private locations: Location[] = [];
  private currentLocation: Location = new Location();
  private currentGeolocation: any = 'unknown';
  private serviceObserver: Subject<any>;
  private clientObservable: Subject<any>;
  private db: any;

  constructor(private geolocation: Geolocation,
              private rest: RestProvider) {
    // firebase.initializeApp(config);
    this.db = firebase.database();
    this.clientObservable = new Subject();
    this.serviceObserver = this.clientObservable;

    let dataRef = this.db.ref('/locations');
    dataRef.on('value', snapshot => {
      this.locations = [];
      snapshot.forEach(childSnapshot => {
        let location = {
          name: childSnapshot.val().name,
          address: childSnapshot.val().address,
          lat: childSnapshot.val().lat,
          lng: childSnapshot.val().lng,
          countAll: childSnapshot.val().countAll,
          googleMapId: childSnapshot.val().googleMapId,
          distanceToMe: 0
        };
        this.locations.push(location);
      });
      this.getCurrentGeolocation();
      // this.notifySubscribers();
    });
  }

  public getCurrentGeolocation(): any {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentGeolocation = {'lat': resp.coords.latitude, 'lng': resp.coords.longitude};
      for (let e of this.locations) {
        let lat1 = this.currentGeolocation.lat;
        let lat2 = e.lat;
        let lon1 = this.currentGeolocation.lng;
        let lon2 = e.lng;
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p) / 2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p)) / 2;
        e.distanceToMe = 12742 * Math.asin(Math.sqrt(a));
      }
      ;
      let locationsClone = JSON.parse(JSON.stringify(this.locations));
      this.locations = locationsClone.sort(function (a, b) {
        if (a.distanceToMe < b.distanceToMe) {
          return -1;
        } else {
          return 1;
        }
      });
      this.currentLocation = this.locations[0];
    }).catch((error) => {
      this.currentGeolocation = 'unknown';
      this.currentLocation = this.locations[0];
    });
    console.log('this.notifySubscribers();', this.currentGeolocation)
    this.notifySubscribers();
    return this.currentGeolocation;
  }

  public getCurrentLocation(): Location {
    return JSON.parse(JSON.stringify(this.currentLocation));
  }


  public dev_initLocations() {
    // this.http.get('../../assets/cache/default_locations.js').subscribe(data => {
    //   console.log(data);
    // })
    console.log(Default_locations);
    Default_locations.forEach((item, index) => {
      let location = new Location(item.name, item.vicinity, item.geometry.location.lat, item.geometry.location.lng, 0, item.id);
      // console.log(location);
      this.addLocation(location);
    })
  }

  public dev_fakeGeolocation() {
    this.currentGeolocation = {'lat': 42.280775, 'lng': -83.739845};
    for (let e of this.locations) {
      let lat1 = this.currentGeolocation.lat;
      let lat2 = e.lat;
      let lon1 = this.currentGeolocation.lng;
      let lon2 = e.lng;
      let p = 0.017453292519943295;    // Math.PI / 180
      let c = Math.cos;
      let a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;
      e.distanceToMe = 12742 * Math.asin(Math.sqrt(a));
    }
    ;
    let locationsClone = JSON.parse(JSON.stringify(this.locations));
    this.locations = locationsClone.sort(function (a, b) {
      if (a.distanceToMe < b.distanceToMe) {
        return -1;
      } else {
        return 1;
      }
    });
    this.currentLocation = this.locations[0];
  }

  // private initLocations() {
  //
  //
  //   let defaultLocation = {lat: 42.278382, lng: -83.735014};
  //   let mapService = new google.maps.places.PlacesService(mapObj);
  //
  //   let mapObj = new google.maps.Map(document.getElementById('map'), {
  //     center: defaultLocation,
  //     zoom: 15
  //   });
  //
  //   infowindow = new google.maps.InfoWindow();
  //   var service = new google.maps.places.PlacesService(map);
  //   service.nearbySearch({
  //     location: pyrmont,
  //     radius: 500,
  //     type: ['store']
  //   }, callback);
  // }


  public getObservable(): Observable<Location[]> {
    return this.clientObservable;
  }

  private notifySubscribers(): void {
    this.serviceObserver.next(undefined);
  }

  public getNearbyLocations(): Location[] {
    return JSON.parse(JSON.stringify(this.locations));
  }

  public getPopularLocations(): Location[] {
    let locationsClone = JSON.parse(JSON.stringify(this.locations));
    return locationsClone.sort(function (a, b) {
      if (a.countAll > b.countAll) {
        return -1;
      } else {
        return 1;
      }
    }).slice(0, 3);
  }

  public getLocationByID(id: any): Location {
    for (let e of this.locations) {
      if (e.googleMapId === id) {
        let clone = JSON.parse(JSON.stringify(e));
        return clone;
      }
    }
    return undefined;
  }

  public updateCurrentLocationByUser(location: Location): void {
    this.currentLocation = location;
    this.serviceObserver.next(undefined);
  }

  public updateCurrentLocationByGPS(lat: number, lng: number): void {
    this.serviceObserver.next(undefined);
  }

  public addLocation(location: Location, isSetAsCurrent: boolean = false): void {
    this.db.ref('/locations/' + location.googleMapId).set({
      name: location.name,
      address: location.address,
      lat: location.lat,
      lng: location.lng,
      countAll: location.countAll,
      googleMapId: location.googleMapId
    });
    if (isSetAsCurrent) {
      this.currentLocation = location;
    }
  } // !!! Don't save Location.distanceToMe online !!!

  // public updateEntry(key, newEntry: Entry): void {
  //   let parentRef = this.db.ref('/locations');
  //   let childRef = parentRef.child(key);
  //   let updateRecord = {
  //     // id: newEntry.id,
  //     location: newEntry.location,
  //     mood: newEntry.mood,
  //     text: newEntry.text,
  //     timestamp: new Date(newEntry.timestamp).toLocaleString()
  //   }
  //   childRef.set(updateRecord);
  //   this.notifySubscribers();
  // }

  public updateLocationCount(location: Location): void {
    this.db.ref('/locations/' + location.googleMapId + '/countAll').set(location.countAll + 1);
    this.notifySubscribers();
  }

  public initLocationsFromGoogle(): void {
    let newLocations = this.rest.getListLocations(this.currentGeolocation.lat, this.currentGeolocation.lng);
    console.log('newLocations', newLocations);
  }


}
