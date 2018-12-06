import { Injectable } from '@angular/core';
import { RestServiceProvider } from './rest-service';
import { HttpParams } from '@angular/common/http';

/*
  Generated class for the RestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AsentamientoService {

    constructor(public restService: RestServiceProvider) {
    }

    public getPaises() {
        let params = new HttpParams();
        var form = new FormData();
        return this.restService.restServicePOST("asentamientos/getPaises", form);
    }

    public getEstados(id: Number) {
        let params = new HttpParams();
        params = params.append('idPais', id.toString());
        var form = new FormData();
        form.append("idPais", id.toString());//
        return this.restService.restServicePOST("asentamientos/getEstados", form);
    }

    public getMunicipios(id: Number) {
        let params = new HttpParams();
        params = params.append('idEntidad', id.toString());
        var form = new FormData();
        form.append("idEntidad", id.toString());//
        return this.restService.restServicePOST("asentamientos/getMunicipios", form);
    }
}
