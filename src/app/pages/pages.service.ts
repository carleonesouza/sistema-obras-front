import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(private _httpClient: HttpClient ) { }


  getDoc(): Observable<any>{
    return this._httpClient.get<any>(environment.apiDocs + 'api-docs')
      .pipe();

  }
}
