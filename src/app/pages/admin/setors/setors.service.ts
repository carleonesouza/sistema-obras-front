import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Setor } from 'app/models/setor';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetorsService {

  private _setores: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _setor: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  get setores$(): Observable<any[]> {
    return this._setores.asObservable();
  }

  get setor$(): Observable<any> {
    return this._setor.asObservable();
  }

  getSetores() {
    return this._httpClient.get<any>(environment.apiManager + 'setores')
      .pipe(
        tap((result) => {
          const data = result?.data;
          const setores = data;
          this._setores.next(setores);
        }),
        catchError(this.error.handleError<any>('getSetores'))
      );
  }


  getSetortById(id: string): Observable<any> {
      return this._httpClient.get<any>(environment.apiManager + `setores/${id}`)
      .pipe(
        tap((result) => {
          this._setor.next(result?.data);
        }),
        catchError(this.error.handleError<any>('getSetortById'))
      );
  }

  atualizaSetor(setor: Setor): Observable<any> {
    return this._httpClient.put<any>(environment.apiManager + `setores/${setor.id}`, setor)
      .pipe(
        tap((result) => {
          // Update the roles list after a successful update
          const updatedSetores = this._setores.value || [];
          const updatedSetorIndex = updatedSetores.findIndex((r) => r.id === setor.id);
          if (updatedSetorIndex !== -1) {
            updatedSetores[updatedSetorIndex] = result?.data;
          }
          this._setores.next(updatedSetores);
        }),
        catchError(this.error.handleError<any>('atualizaSetor'))
      );
  }

  addSetor(setor: Setor): Observable<any> {
    
    return this._httpClient.post<any>(environment.apiManager + `setores/${setor.id}`, setor)
      .pipe(
        tap((result) => {
          this._setores.next([...(this._setores.value || []), result.data]);
          this._setor.next(result.data);
        }),
        catchError(this.error.handleError<any>('addSetor'))
      );
  }

  deleteSetor(setor: Setor): Observable<any> {
    return this._httpClient.delete(environment.apiManager + `setores/${setor.id}`,{
      body: setor
    })
      .pipe(
        tap(() => {
          const updatedSetores = this._setores.value || [];
          const iniciativaIndex = updatedSetores.findIndex((st) => st.id === setor.id);
          if (iniciativaIndex !== -1) {
            updatedSetores.splice(iniciativaIndex, 1);
            this._setores.next(updatedSetores);
          }
        }),
       
        catchError(this.error.handleError<any>('deleteSetor'))
      );
  }

}
