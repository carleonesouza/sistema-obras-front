import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Empreendimento } from 'app/models/empreendimento';
import { Usuario } from 'app/models/usuario';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap, tap, take, map, filter } from 'rxjs/operators';


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
    
    return this._httpClient.get<any[]>(environment.apiManager + 'empreendimentos', {params:{
      page, size
    }})
      .pipe(
        tap((result) => {
          let empreendimentos = result;
          empreendimentos = empreendimentos.sort((a, b) => a?.name.localeCompare(b?.name));
          this._empreendimentos.next(empreendimentos);
        }),
        catchError(this.error.handleError<any[]>('getAllempreendimentos'))
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
    return this.empreendimentos$.pipe(
      take(1),
      switchMap(empreendimentos => this._httpClient.put<any>(environment.apiManager + 'empreendimentos/'+empreendimento.id, empreendimento)
        .pipe(
          map((updatedempreendimento) => {

            // Find the index of the updated empreendimento
            const index = empreendimentos.findIndex(item => item.id === empreendimento.id);

            // Update the empreendimento
            empreendimentos[index] = updatedempreendimento;

            // Update the empreendimentos
            this._empreendimentos.next(empreendimentos);

            // Return the updated empreendimento
            return updatedempreendimento;
          }),
          switchMap(updatedempreendimento => this.empreendimento$.pipe(
            take(1),
            filter(item => item && item._id === empreendimento.id),
            tap(() => {
              // Update the empreendimento if it's selected
              this._empreendimento.next(updatedempreendimento);

              // Return the empreendimento
              return updatedempreendimento;
            })
          )),
          catchError(this.error.handleError<any>('editempreendimento'))
        ))
    );
  }



  searchempreendimentoByContract(contratoId): Observable<any[]>{
      return this._httpClient.get<any[]>(environment.apiManager + 'empreendimentos/busca-empreendimentos-por-contrato', {params: contratoId})
      .pipe(
        tap((empreendimentos) => {
          this._empreendimentos.next(empreendimentos);
        }),
        catchError(this.error.handleError<any>('searchempreendimentoByContract'))
      );
  }

  addEmpreendimento(empreendimento): Observable<any> {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.post(environment.apiManager + 'empreendimentos', empreendimento)
      .pipe(
        tap(result => this._empreendimento.next(result)),
        catchError(this.error.handleError<any>('addempreendimento'))
      );
  }

  deleteEmpreendimento(empreendimento: Empreendimento): Observable<any> {
    return this._httpClient.delete(environment.apiManager + 'empreendimentos'+empreendimento.id)
      .pipe(
        tap(result => this._empreendimento.next(result)),
        catchError(this.error.handleError<any>('deleteempreendimento'))
      );
  }

}
