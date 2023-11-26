import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { Observable, tap, catchError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SituacaoService {

  private _situacoes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _situacao: BehaviorSubject<any | null> = new BehaviorSubject(null);
 
  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  get sitaucoes$(): Observable<any[]> {
    return this._situacoes.asObservable();
  }

  get situacao$(): Observable<any> {
    return this._situacao.asObservable();
  }

  getSitaucoes(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'situacoes')
    .pipe(
      tap((result) => {
        const situacoes = result.data;          
        this._situacoes.next(situacoes);
      }),
      catchError(this.error.handleError<any>('getSitaucoes'))
    );
  }


  addSituacao(situacao): Observable<any> {
    return this._httpClient.post<any>(environment.apiManager + 'situacoes', situacao)
      .pipe(
        tap((result) => {
          this._situacoes.next([...(this._situacoes.value || []), result.data]);
          this._situacao.next(result.data);
        }),
        catchError(this.error.handleError<any>('addSituacao'))
      );
  }

}
