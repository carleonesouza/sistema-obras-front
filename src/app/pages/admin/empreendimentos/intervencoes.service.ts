import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { Observable, tap, catchError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntervencoesService {

  private _intervencoes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _intervencao: BehaviorSubject<any | null> = new BehaviorSubject(null);
 
  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  get intervencoes$(): Observable<any[]> {
    return this._intervencoes.asObservable();
  }

  get intervencao$(): Observable<any> {
    return this._intervencao.asObservable();
  }

  getIntervencoes(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'intervencoes')
    .pipe(
      tap((result) => {
        const infras = result.data;          
        this._intervencoes.next(infras);
      }),
      catchError(this.error.handleError<any>('getIntervencoes'))
    );
  }


  addIntervencao(intervencao): Observable<any> {
    return this._httpClient.post<any>(environment.apiManager + 'intervencoes', intervencao)
      .pipe(
        tap((result) => {
          this._intervencoes.next([...(this._intervencoes.value || []), result.data]);
          this._intervencao.next(result.data);
        }),
        catchError(this.error.handleError<any>('addIntervencao'))
      );
  }

}
