import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { EntryDetailPage } from '../pages/entry-detail/entry-detail';
import { ChartPage } from '../pages/chart/chart';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { CurrentPage } from '../pages/current/current';
import { NewLocationPage } from '../pages/new-location/new-location';
import { NewMoodPage } from '../pages/new-mood/new-mood';
import { LocationListPage } from "../pages/location-list/location-list";
import { LocationListNewPage } from "../pages/location-list-new/location-list-new";

import firebase from 'firebase';
import { UsersserviceProvider } from '../providers/usersservice/usersservice';
import { EntryDataServiceProvider } from '../providers/entry-data-service/entry-data-service';
import { LocationDataServiceProvider } from '../providers/location-data-service/location-data-service';
import { RestProvider } from '../providers/rest/rest';

export const firebaseConfig = {
  apiKey: "AIzaSyC9ICYAY0GONi1mgiGgRjAAuaev2qqosvM",
  authDomain: "mood-tracker-8f5b8.firebaseapp.com",
  databaseURL: "https://mood-tracker-8f5b8.firebaseio.com",
  projectId: "mood-tracker-8f5b8",
  storageBucket: "mood-tracker-8f5b8.appspot.com",
  messagingSenderId: "1047636349755"
};


//   apiKey: "AIzaSyBU4FhZ_0XJF9-GpUxvRCfXFP14PnANb6o",
//   authDomain: "moodtracker-b75bd.firebaseapp.com",
//   databaseURL: "https://moodtracker-b75bd.firebaseio.com",
//   projectId: "moodtracker-b75bd",
//   storageBucket: "moodtracker-b75bd.appspot.com",
//   messagingSenderId: "587504295484"
// };
firebase.initializeApp(firebaseConfig);


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    EntryDetailPage,
    ChartPage,
    TabsPage,
    CurrentPage,
    NewMoodPage,
    NewLocationPage,
    SettingsPage,
    LocationListPage,
    LocationListNewPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    EntryDetailPage,
    ChartPage,
    TabsPage,
    CurrentPage,
    NewMoodPage,
    NewLocationPage,
    SettingsPage,
    LocationListPage,
    LocationListNewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    LocalNotifications,
    UsersserviceProvider,
    EntryDataServiceProvider,
    LocationDataServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider
  ]
})
export class AppModule {}
