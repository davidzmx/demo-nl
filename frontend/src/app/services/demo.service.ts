import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backend_url } from '../config/url.config'

@Injectable({
    providedIn: 'root'
})
export class DemoService {
    readonly URL_API_STATE_POLYGON = backend_url + '/apidemo/getStatePolygon/';
    readonly URL_API_SEARCH_FILTER = backend_url + '/apidemo/searchFilter/';
    readonly URL_API_CONSULTA_DENUE = backend_url + '/apidemo/consultaDenue/';
    readonly URL_API_CENSO_ECONOMICO = backend_url + '/apidemo/censoEconomico/';
    readonly URL_API_SUBCATEGORIES_DENUE = backend_url + '/apidemo/subcategoriesDenue/';
    readonly URL_API_HISTORICAL_DENUE = backend_url + '/apidemo/historicalDenue/';
    readonly URL_API_GET_COLONIA_FROM_AGEB = backend_url + '/apidemo/getColoniaFromAgeb/';
    readonly URL_API_GET_MUNICIPIO_FROM_AGEB = backend_url + '/apidemo/getMunicipioFromAgeb/';
    readonly URL_API_GET_MANZANAS_FROM_AGEB = backend_url + '/apidemo/getManzanasFromAgeb/';

    constructor(private http: HttpClient) { }

    getStatePolygon(state_cve){ //19 - Nuevo León
        return this.http.post(this.URL_API_STATE_POLYGON, {
            "cvegeo_entidad": state_cve
        });
    }

    searchInfo(filter,nivel){ 
        return this.http.post(this.URL_API_SEARCH_FILTER, {
            "filter": filter,
            "nivel": nivel
        }).toPromise();
    }    

    consultaDenue(cvegeo, nivel, wkt){ 
        return this.http.post(this.URL_API_CONSULTA_DENUE, {
            "cvegeo": cvegeo,
            "nivel": nivel,
            "wkt": wkt
        });
    }    
    
    getCensoEconomico(id) {
        return this.http.post(this.URL_API_CENSO_ECONOMICO, { municipio: id }).toPromise();
    }   

    getSubcategoriesDenue() {
        return this.http.post(this.URL_API_SUBCATEGORIES_DENUE, {}).toPromise();
    }     
    
    getHistoricalDenue(cvegeo, nivel, wkt , subsector){ 
        return this.http.post(this.URL_API_HISTORICAL_DENUE, {
            "cvegeo": cvegeo,
            "nivel": nivel,
            "wkt": wkt,
            "subsector": subsector
        }).toPromise();
    }       

    getColoniaFromAgeb(wkt){ 
        return this.http.post(this.URL_API_GET_COLONIA_FROM_AGEB, {
            "wkt": wkt
        }).toPromise();
    }     
    
    getMunicipioFromAgeb(municipio_cve){ 
        return this.http.post(this.URL_API_GET_MUNICIPIO_FROM_AGEB, {
            "municipio_cve": municipio_cve
        }).toPromise();
    }      

    getManzanasFromAgeb(ageb_cve, wkt){ 
        return this.http.post(this.URL_API_GET_MANZANAS_FROM_AGEB, {
            "ageb_cve": ageb_cve,
            "wkt": wkt
        }).toPromise();
    }      

}
