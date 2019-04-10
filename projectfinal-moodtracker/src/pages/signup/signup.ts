import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { UsersserviceProvider } from '../../providers/usersservice/usersservice';
import * as firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from "../login/login";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [UsersserviceProvider]
})
export class SignupPage {

  public email : string = "";
  public password : any = "";
  // public displayName : any = "";


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public usersserviceProvider : UsersserviceProvider,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }


  public doSignup(){

    if (this.email === '' || this.password === '') {
      let toast = this.toastCtrl.create({
        message: 'Please fill in all the fields',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return undefined
    }

    let   account = {
      email: this.email,
      password: this.password
    };
    let that = this;

    let loader = this.loadingCtrl.create({
      content: "Please wait...",

    });
    loader.present();


    this.usersserviceProvider.signupUserService(account).then(authData => {
      //successful
      loader.dismiss();
      that.navCtrl.setRoot(TabsPage);

    }, error => {
      loader.dismiss();
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000,
        position: 'top'
      });
      toast.present();

      that.password = ""//empty the password field

    });


  }

  public redirectToLogin(){
    this.navCtrl.setRoot(LoginPage);
  }

}
