import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { Storage } from "@ionic/storage";

import { EntryDataServiceProvider } from "../entry-data-service/entry-data-service";

/*
  Generated class for the UsersserviceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()



export class UsersserviceProvider {

  // public data: any;
  public fireAuth: any;
  // public userProfile: any;
  private serviceObserver: Subject<any>;
  private clientObservable: Subject<any>;

  constructor(private storage: Storage, private entryService: EntryDataServiceProvider) {
    this.fireAuth = firebase.auth();
    // this.userProfile = firebase.database().ref('users');
    this.clientObservable = new Subject();
    this.serviceObserver = this.clientObservable;
  }


  public getObservable(): Subject<any> {
    return this.clientObservable;
  }

  private notifySubscribers(): void {
    this.serviceObserver.next(undefined);
  }

  public loginUserService(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password).then((newUser) => {
      this.storage.set('user-email', firebase.auth().currentUser.email);
      this.storage.set('user-uid', firebase.auth().currentUser.uid);
      this.entryService.updateCache(firebase.auth().currentUser.uid);

      // this.notifySubscribers();
    });
  }


  public signupUserService(account: {}){
    return this.fireAuth.createUserWithEmailAndPassword(account['email'], account['password']).then((newUser) => {
      //sign in the user
      this.fireAuth.signInWithEmailAndPassword(account['email'], account['password']).then((authenticatedUser) => {

        this.storage.set('user-email', firebase.auth().currentUser.email);
        this.storage.set('user-uid', firebase.auth().currentUser.uid);
        this.entryService.updateCache(firebase.auth().currentUser.uid);
        // this.notifySubscribers();
        //successful login, create user profile
        // this.userProfile.child(authenticatedUser.uid).set(
        //   account
        // );
        // return authenticatedUser.updateProfile({'displayName': account['displayName']}).catch(function(error) {
        //   console.log('Error updateing user profile:', error);
        // });
      });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error signing up:', errorCode, errorMessage);
    });

  }

  public signout() {
    this.fireAuth.signOut();
    this.storage.remove('user-email');
    this.storage.remove('user-uid');
    this.entryService.updateCache('blank');
    // this.notifySubscribers();
  }

  public getProfileName() {
    let user = firebase.auth().currentUser;
    console.log('user', user);
    let name = 'New user';
    if (user != null) {
      name = user.email;
    }
    return name;
  }
  public getProfileUID() {
    let user = firebase.auth().currentUser;
    console.log('user', user);
    let uid = 'logout';
    if (user != null) {
      uid = user.uid;
    }
    return uid;
  }
}
