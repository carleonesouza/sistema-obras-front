import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Iniciativa } from 'app/models/iniciativa';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IniciativasService {

  private _iniciativas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _iniciativa: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  get iniciativas$(): Observable<any[]> {
    return this._iniciativas.asObservable();
  }

  get iniciativa$(): Observable<any> {
    return this._iniciativa.asObservable();
  }


  getAllIniciativas() {
    return this._httpClient.get<any>(environment.apiManager + 'iniciativas')
      .pipe(
        tap((result) => {
          const data = result?.data;
          const iniciativas = data;
          this._iniciativas.next(iniciativas);
        }),
        catchError(this.error.handleError<any>('getAllIniciativas'))
      );
  }


  getIniciativatById(id: string): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + `iniciativas/${id}`)
      .pipe(
        tap((result) => {
          this._iniciativa.next(result?.data);
        }),
        catchError(this.error.handleError<any>('getIniciativatById'))
      );
  }


  editIniciativa(iniciativa: Iniciativa): Observable<any> {
    return this._httpClient.put<any>(environment.apiManager + `iniciativas/${iniciativa.id}`, iniciativa)
    .pipe(
      tap((result) => {
        const updatedIniciativas = this._iniciativas.value || [];
        const iniciativaIndex = updatedIniciativas.findIndex((inicia) => inicia.id === iniciativa.id);
        if (iniciativaIndex !== -1) {
          updatedIniciativas[iniciativaIndex] = result.data;
          this._iniciativas.next(updatedIniciativas);
        }
        this._iniciativa.next(result.data);
      }),
      catchError(this.error.handleError<any>('editIniciativa'))
    );
  }

  deactivateActiveItem(iniciativa: Iniciativa): Observable<any>{
    return this._httpClient.patch<any>(environment.apiManager + `iniciativas/${iniciativa.id}`, iniciativa)
    .pipe(
      tap((result) => {
        const updatedIniciativas = this._iniciativas.value || [];
        const iniciativaIndex = updatedIniciativas.findIndex((inicia) => inicia.id === iniciativa.id);
        if (iniciativaIndex !== -1) {
          updatedIniciativas[iniciativaIndex] = result.data;
          this._iniciativas.next(updatedIniciativas);
        }
        this._iniciativa.next(result.data);
      }),
      catchError(this.error.handleError<any>('deactivateActiveItem'))
    );
  }



  addIniciativa(iniciativa: Iniciativa): Observable<any> {

    return this._httpClient.post<any>(environment.apiManager + `iniciativas`, iniciativa)
      .pipe(
        tap((result) => {
          this._iniciativas.next([...(this._iniciativas.value || []), result.data]);
          this._iniciativa.next(result.data);
        }),
        catchError(this.error.handleError<any>('addIniciativa'))
      );
  }

  deleteIniciativa(iniciativa: Iniciativa): Observable<any> {
    return this._httpClient.delete(environment.apiManager + `iniciativas/${iniciativa.id}`, {
      body: iniciativa
    })
      .pipe(
        tap(() => {
          const updatedIniciativas = this._iniciativas.value || [];
          const iniciativaIndex = updatedIniciativas.findIndex((user) => user.id === iniciativa.id);
          if (iniciativaIndex !== -1) {
            updatedIniciativas.splice(iniciativaIndex, 1);
            this._iniciativas.next(updatedIniciativas);
          }
        }),
        catchError(this.error.handleError<any>('deleteIniciativa'))
      );
  }

}
