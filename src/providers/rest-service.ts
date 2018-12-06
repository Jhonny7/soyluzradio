import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the RestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestServiceProvider {
  //Path de ambiente local
  //public pathService: String = "http://localhost/api_radio/";
  //Path de ambiente producción
  public pathService: String = "http://www.soyluzradio.com/api_radio/";

  public headerError: string = "Error!";
  public mensajeError: string = "Verifica tu conexión o tiempo excedido";
  public headerValidacion: string = "Advertencia!";
  public headerExito: string = "Bien!";

  public timeOver: number = 10000;// 10 segundos de espera en servicios


  constructor(public http: HttpClient) {
  }

  public restServiceGET(path: string, params: HttpParams) {
    let headers = new HttpHeaders();
    headers.append('Cache-control', 'no-cache');
    headers.append('Cache-control', 'no-store');
    headers.append('Expires', '0');
    headers.append('Pragma', 'no-cache'); 
    console.log(params);
    return this.http.get(this.pathService + path+"?fl=1", { headers: headers, params: params });
  }

  public restServicePOST(path: string, params: any) {
    //let config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post(this.pathService + path, params);
  }
}
