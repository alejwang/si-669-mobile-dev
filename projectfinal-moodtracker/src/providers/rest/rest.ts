import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {


  constructor(public http: HttpClient) {
    // console.log('Hello RestProvider Provider');

  }
  getListLocations(lat, lng): any {
    let apiUrl = '/api';
    let urlSearchParams = {
      'key':'AIzaSyD6MTT0ofqku0B2PFugvKks5gykEid_Tkw',
      'radius':500,
      'location':lat.toString()+','+lng.toString()
    }
    let private_options = { headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }) };

    this.http.post(apiUrl, urlSearchParams, private_options).subscribe(data => {
        console.log('restdata', data);
        return data;
      }, err => {
        console.log(err);
      });
  }

}
