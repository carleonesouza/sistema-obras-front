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

  getIntervencoes(page = 0, size = 10): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'intervencoes')
      .pipe(
        tap((result) => {
          let inter = result.data;
          inter = inter.sort((a, b) => a.descricao.localeCompare(b.descricao));   
          this._intervencoes.next(inter);
        }),
        catchError(this.error.handleError<any>('getIntervencoes'))
      );
  }

  getIntervencaoById(id): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + `intervencoes/${id}`)
      .pipe(
        tap((result) => {
          const intervencoes = result.data;
          this._intervencao.next(intervencoes);
        }),
        catchError(this.error.handleError<any>('getIntervencaoById'))
      );
  }

  getIntervencaoBySetorId(setor): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + `intervencoes/setor/${setor}`)
    .pipe(
      tap((result) => {
        let intervencoes = result.data;  
        intervencoes = intervencoes.sort((a, b) => a.descricao.localeCompare(b.descricao));           
        this._intervencoes.next(intervencoes);
      }),
      catchError(this.error.handleError<any>('getIntervencaoBySetorId'))
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

  searchItemByDescription(contratoId): Observable<any[]> {
    return this._httpClient.get<any[]>(environment.apiManager + 'empreendimentos/busca-empreendimentos-por-contrato', { params: contratoId })
      .pipe(
        tap((intervecao) => {
          this._intervencoes.next(intervecao);
        }),
        catchError(this.error.handleError<any>('searchItemByDescription'))
      );
  }

}
