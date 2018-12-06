import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
  selector: 'page-acercade',
  templateUrl: 'acercade.html',
})
export class AcercadePage {
  public versionCode: any;
  public versionNumber: any;
  public anio: any;
  public imei:any = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public appVersion: AppVersion, public platform: Platform,
    public uid: Uid, private androidPermissions: AndroidPermissions) {
    this.anio = (new Date()).getFullYear();
    if (this.platform.is('ios') || this.platform.is('android')) {
      appVersion.getVersionCode().then((s) => {
        this.versionCode = s;
      });

      appVersion.getVersionNumber().then((s) => {
        this.versionNumber = s;
      });
      this.getImei().then((s) => {
        this.imei = s;
      });
    } else {
      this.versionCode = "1.0.0";
      this.versionNumber = "1.0.0";
      this.imei = "00000000000000";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcercadePage');
  }

  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
   
    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
   
      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }
   
      // ok, a user gave us permission, we can get him identifiers after restart app
      return;
    }
   
     return this.uid.IMEI
   }
}
