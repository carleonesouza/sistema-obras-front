import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoInfraestruturaService {

  private _tiposInfras: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _tipoInfra: BehaviorSubject<any | null> = new BehaviorSubject(null);
 
  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  get tiposInfras$(): Observable<any[]> {
    return this._tiposInfras.asObservable();
  }

  get tipoInfra$(): Observable<any> {
    return this._tipoInfra.asObservable();
  }

  getAllInfras(page = 0, size = 10): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'tipos-infra')
    .pipe(
      tap((result) => {
        let infras = result.data;  
        infras = infras.sort((a, b) => a.descricao.localeCompare(b.descricao));           
        this._tiposInfras.next(infras);
      }),
      catchError(this.error.handleError<any>('getAllInfras'))
    );
  }

  getInfraById(id): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + `tipos-infra/${id}`)
    .pipe(
      tap((result) => {
        const infra = result.data;          
        this._tipoInfra.next(infra);
      }),
      catchError(this.error.handleError<any>('getInfraById'))
    );
  }

  getInfrasBySetorId(setor): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + `tipos-infra/setor/${setor}`)
    .pipe(
      tap((result) => {
        let infras = result.data;  
        infras = infras.sort((a, b) => a.descricao.localeCompare(b.descricao));           
        this._tiposInfras.next(infras);
      }),
      catchError(this.error.handleError<any>('getInfrasBySetorId'))
    );
  }


  addTipoInfraestrutura(tipoInfra): Observable<any> {
    return this._httpClient.post<any>(environment.apiManager + 'tipo-infras', tipoInfra)
      .pipe(
        tap((result) => {
          this._tiposInfras.next([...(this._tiposInfras.value || []), result.data]);
          this._tipoInfra.next(result.data);
        }),
        catchError(this.error.handleError<any>('addTipoInfraestrutura'))
      );
  }

  searchTipoObraByDescription(contratoId): Observable<any[]>{
    return this._httpClient.get<any[]>(environment.apiManager + 'empreendimentos/busca-empreendimentos-por-contrato', {params: contratoId})
    .pipe(
      tap((infra) => {
        this._tiposInfras.next(infra);
      }),
      catchError(this.error.handleError<any>('searchTipoObraByDescription'))
    );
}

}
