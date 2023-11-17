import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Empreendimento } from 'app/models/empreendimento';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmpreendimentosService {

  private _empreendimentos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _empreendimento: BehaviorSubject<any | null> = new BehaviorSubject(null);

 
  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get empreendimentos$(): Observable<any[]> {
    return this._empreendimentos.asObservable();
  }

  get empreendimento$(): Observable<any> {
    return this._empreendimento.asObservable();
  }



  getAllEmpreendimentos(page = 0, size = 10) {
    
    return this._httpClient.get<any>(environment.apiManager + 'empreendimentos')
      .pipe(
        tap((result) => {
          const empreendimentos = result.data;          
          this._empreendimentos.next(empreendimentos);
        }),
        catchError(this.error.handleError<any>('getAllempreendimentos'))
      );
  }


  getEmpreendimentoById(id): Observable<any> {
      return this._httpClient.get<any>(environment.apiManager + 'empreendimentos/'+id)
      .pipe(
        tap((result) => {
          this._empreendimento.next(result);
        }),
        catchError(this.error.handleError<any>('getempreendimentoById'))
      );
  }


  editEmpreendimento(empreendimento: Empreendimento): Observable<any> {
    return this._httpClient.put<any>(environment.apiManager + `empreendimentos/${empreendimento.id}`, empreendimento)
    .pipe(
      tap((result) => {
        const updatedEmpreendimentos = this._empreendimentos.value || [];
        const empreendimentoIndex = updatedEmpreendimentos.findIndex((empr) => empr.id === empreendimento.id);
        if (empreendimentoIndex !== -1) {
          updatedEmpreendimentos[empreendimentoIndex] = result.data;
          this._empreendimentos.next(updatedEmpreendimentos);
        }
        this._empreendimento.next(result.data);
      }),
      catchError(this.error.handleError<any>('editEmpreendimento'))
    );
  }

  deactivateActiveItem(empreendimento: Empreendimento): Observable<any>{
    return this._httpClient.patch<any>(environment.apiManager + `empreendimentos/${empreendimento.id}`, empreendimento)
    .pipe(
      tap((result) => {
        const updatedEmpreendimentos = this._empreendimento.value || [];
        const EmpreendimentoIndex = updatedEmpreendimentos.findIndex((emp) => emp.id === empreendimento.id);
        if (EmpreendimentoIndex !== -1) {
          updatedEmpreendimentos[EmpreendimentoIndex] = result.data;
          this._empreendimentos.next(updatedEmpreendimentos);
        }
        this._empreendimento.next(result.data);
      }),
      catchError(this.error.handleError<any>('deactivateActiveItem'))
    );
  }


  searchEmpreendimentoByObra(contratoId): Observable<any[]>{
      return this._httpClient.get<any[]>(environment.apiManager + 'empreendimentos/busca-empreendimentos-por-contrato', {params: contratoId})
      .pipe(
        tap((empreendimentos) => {
          this._empreendimentos.next(empreendimentos);
        }),
        catchError(this.error.handleError<any>('searchEmpreendimentoByObra'))
      );
  }

  addEmpreendimento(empreendimento): Observable<any> {
    return this._httpClient.post<any>(environment.apiManager + 'empreendimentos', empreendimento)
      .pipe(
        tap((result) => {
          this._empreendimentos.next([...(this._empreendimentos.value || []), result.data]);
          this._empreendimento.next(result.data);
        }),
        catchError(this.error.handleError<any>('addEmpreendimento'))
      );
  }

  deleteEmpreendimento(empreendimento: Empreendimento): Observable<any> {
    return this._httpClient.delete(environment.apiManager + 'empreendimentos'+empreendimento.id, {
      body: empreendimento
    })
      .pipe(
        tap(() => {
          const updatedEmpreendimentos = this._empreendimentos.value || [];
          const empreendimentoIndex = updatedEmpreendimentos.findIndex((empr) => empr.id === empreendimento.id);
          if (empreendimentoIndex !== -1) {
            updatedEmpreendimentos.splice(empreendimentoIndex, 1);
            this._empreendimentos.next(updatedEmpreendimentos);
          }
        }),
        catchError(this.error.handleError<any>('deleteEmpreendimento'))
      );
  }

}
