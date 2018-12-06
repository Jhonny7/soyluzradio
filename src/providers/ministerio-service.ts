import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MinisterioModel } from '../models/ministerioModel';
import { AlertaServiceProvider } from './alerta-service';
import { NavParams, LoadingController, ViewController } from 'ionic-angular';
import { RestServiceProvider } from './rest-service';

/*
  Generated class for the RestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MinisterioService {
    public model = new MinisterioModel();

    constructor(public alertaService: AlertaServiceProvider, public navParams: NavParams,
        public restService: RestServiceProvider, public loadingCtrl: LoadingController) {

    }

    
}
