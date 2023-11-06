import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, first, map, of, take, tap } from 'rxjs';
import { Caixa } from 'app/models/caixa';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { Venda } from 'app/models/vendas';
import * as _moment from 'moment';
import { Usuario } from 'app/models/usuario';
_moment.locale('pt-br');

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private _caixas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _caixa: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get caixas$(): Observable<Caixa[]> {
    return this._caixas.asObservable();
  }

  get caixa$(): Observable<Caixa> {
    return this._caixa.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  getCaixas(page = 0, size = 10): Observable<Caixa[]> {
    try {
      return this._httpClient.get<Caixa[]>(environment.apiManager + 'cashies', { params: { page, size } })
        .pipe(
          take(1),
          tap((result) => {
            this._caixas.next(result);
          }),
        );
    } catch (err) {
      this.error.handleError<Caixa>('getCaixaById');
    }
  }

  getCaixaToday(id: string, date: string): Observable<Caixa> {
    try {
      return this._httpClient.post<Caixa>(environment.apiManager + 'cashies/day/' + id, { date })
        .pipe(
          tap((result) => {
            localStorage.setItem('caixaId', result._id);
          })
        );
    } catch (err) {
      this.error.handleError<Caixa>('getCaixaById');
    }
  }

  getCaixaById(id: string) {
    try {
      return this._httpClient.get<Caixa>(environment.apiManager + 'cashies/' + id)
        .pipe(
          first(),
          tap((caixa) => {
            this._caixa.next(caixa);
            return caixa;
          }),
        );
    } catch (err) {
      this.error.handleError<Caixa>('getCaixaById');
    }
  }

  getCaixaYestarday(id: string, date: string): Observable<Caixa> {
    try {
      return this._httpClient.post<Caixa>(environment.apiManager + 'cashies/yesterday/' + id, { date })
        .pipe();
    } catch (err) {
      this.error.handleError<Caixa>('getCaixaById');
    }
  }


  /**
   * Abrir caixa do Dia
   *
   * @param caixa
   * @returns Caixa
   */
  addCaixaDay(caixa): Observable<Caixa> {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.post<Caixa>(environment.apiManager + 'cashies/'+_id, caixa)
      .pipe(
        tap((result) => {
          localStorage.setItem('caixaId', result._id);
          this._caixa.next(result);
          return result;
        }),
        catchError(this.error.handleError<Caixa>('addCaixa'))
      );
  }

  closeCaixaDay(caixa: Caixa) {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.put<Caixa>(environment.apiManager + 'cashies/close/' + _id, caixa)
      .pipe(
        tap((result) => {
          console.log(result);
          return result;
        }),
        catchError(this.error.handleError<Caixa>('closeCaixaDay'))
      );
  }

  /**
   *Adicionar Venda ao Caixa do Dia
   *
   * @param venda
   * @returns
   */
  addVendaCaixa(venda: any) {
    if (!localStorage.getItem('caixaId')) {
      this._snackBar.open('Não existe caixa aberto para o dia, Favor abrir caixa antes de realizar a venda!', 'Fechar', {
        duration: 3000
      });
      catchError(this.error.handleError<Caixa>('AddVendaCaixa'));
    } else {
      return this._httpClient.put<Caixa>(environment.apiManager + 'cashies/' + localStorage.getItem('caixaId'), [venda])
        .pipe(
          tap((result) => {
            this._caixa.next(result);

            this._snackBar.open('Compra Salva com Sucesso!', 'Fechar', {
              duration: 3000
            });
          }),
          catchError(this.error.handleError<Caixa>('addVendaCaixa'))
        );
    }
  }

  createVenda(venda: any) {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    if (!localStorage.getItem('caixaId')) {
      this._snackBar.open('Não existe caixa aberto para o dia, Favor abrir caixa antes de realizar a venda!', 'Fechar', {
        duration: 3000
      });
      catchError(this.error.handleError<Venda>('createVenda'));
    } else {
      return this._httpClient.post<Venda>(environment.apiManager + 'orders/'+_id, venda)
        .pipe(
          tap((result) => {
            this._caixa.next(result);
          }),
          catchError(this.error.handleError<Venda>('createVenda'))
        );
    }
  }

}
