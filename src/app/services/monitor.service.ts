import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IntegracaoFilter } from '../interfaces/integracao.interfaceFilter';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  constructor(private httpClient: HttpClient) { }

  url = environment.url

  getIntegrations(filter:IntegracaoFilter):Observable<any>{
    return this.httpClient.post<any>(this.url + "getIntegrations", filter)
  }

  getStatusPasoe():Observable<any>{
    return this.httpClient.get<any>(this.url + "getStatusPasoe")
  }

  getNovasEntradas():Observable<any>{
    return this.httpClient.get<any>(this.url + "getNovasEntradas")
  }

  getEnderecoPasoe():Observable<any>{
    return this.httpClient.get<any>(this.url + "pasoe")
  }

  setEnderecoPasoe(caminhoPasoe:string):Observable<any>{
    return this.httpClient.post<any>(this.url + "pasoe", { caminhoPasoe })
  }
}