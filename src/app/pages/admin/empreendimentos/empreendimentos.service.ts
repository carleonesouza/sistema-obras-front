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

  private _produtos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _produto: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _infraEstruturas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _infraEstrutura: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _obras: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _obra: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _naturezas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _natureza: BehaviorSubject<any | null> = new BehaviorSubject(null);


  private _statues: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _status: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _estados: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
 
  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get empreendimentos$(): Observable<any[]> {
    return this._empreendimentos.asObservable();
  }

  get empreendimento$(): Observable<any> {
    return this._empreendimento.asObservable();
  }

  get produtos$(): Observable<any[]> {
    return this._produtos.asObservable();
  }

  get produto$(): Observable<any> {
    return this._produto.asObservable();
  }

  get infras$(): Observable<any[]> {
    return this._infraEstruturas.asObservable();
  }

  get infra$(): Observable<any> {
    return this._infraEstrutura.asObservable();
  }

  get obras$(): Observable<any[]> {
    return this._obras.asObservable();
  }

  get obra$(): Observable<any> {
    return this._obra.asObservable();
  }

  get estados$(): Observable<any[]> {
    return this._estados.asObservable();
  }

  get statues$(): Observable<any[]> {
    return this._statues.asObservable();
  }

  get status$(): Observable<any> {
    return this._status.asObservable();
  }


  get naturezas$(): Observable<any[]> {
    return this._naturezas.asObservable();
  }

  get natureza$(): Observable<any> {
    return this._natureza.asObservable();
  }

  getAllProdutos(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'produtos')
    .pipe(
      tap((result) => {
        const produtos = result.data;          
        this._produtos.next(produtos);
      }),
      catchError(this.error.handleError<any>('getAllProdutos'))
    );
  }

  getAllStatues() {
    return this._httpClient.get<any>(environment.apiManager + 'status')
      .pipe(
        tap((result) => {
          const data = result?.data;
          const statues = data;
          this._statues.next(statues);
        }),
        catchError(this.error.handleError<any>('getAllStatues'))
      );
  }

  getAllInfras(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'tipos-infra')
    .pipe(
      tap((result) => {
        const infras = result.data;          
        this._infraEstruturas.next(infras);
      }),
      catchError(this.error.handleError<any>('getAllInfras'))
    );
  }

  getEstados(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'estados')
    .pipe(
      tap((result) => {
        const estados = result.data;          
        this._estados.next(estados);
      }),
      catchError(this.error.handleError<any>('getEstados'))
    );
  }

  getEmpreendimentosBySetor(setor): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + `empreendimentos/setor/${setor}`)
    .pipe(
      tap((result) => {
        const empreends = result.data;          
        this._empreendimentos.next(empreends);
      }),
      catchError(this.error.handleError<any>('getEmpreendimentosBySetor'))
    );
  }

  getNaturezaEmpreendimentos(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'natureza-empreendimentos')
    .pipe(
      tap((result) => {
        const naturezas = result.data;          
        this._naturezas.next(naturezas);
      }),
      catchError(this.error.handleError<any>('getNaturezaEmpreendimentos'))
    );
  }

  getAllEmpreendimentos(page = 0, size = 10) {
    
    return this._httpClient.get<any>(environment.apiManager + 'empreendimentos')
      .pipe(
        tap((result) => {
          let empreendimentos = result.data;       
          empreendimentos = empreendimentos.sort((a, b) => a.nome.localeCompare(b.nome));   
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

  getObras(page = 0, size = 10) {
    return this._httpClient.get<any>(environment.apiManager + 'obras')
      .pipe(
        tap((result) => {
          const obras = result.data;          
          this._obras.next(obras);
        }),
        catchError(this.error.handleError<any>('getObras'))
      );
  }

  getObra(id) {
    return this._httpClient.get<any>(environment.apiManager + `obras/${id}`)
      .pipe(
        tap((result) => {
          const obra = result.data;          
          this._obra.next(obra);
          return result.data; 
        }),
        catchError(this.error.handleError<any>('getObra'))
      );
  }

  editObra(obra: any): Observable<any> {
    return this._httpClient.put<any>(environment.apiManager + `obras/${obra.id}`, obra)
    .pipe(
      tap((result) => {
        const updatedObras = this._obras.value || [];
        const obraIndex = updatedObras.findIndex((obr) => obr.id === obra.id);
        if (obraIndex !== -1) {
          updatedObras[obraIndex] = result.data;
          this._obras.next(updatedObras);
        }
        this._obra.next(result.data);
      }),
      catchError(this.error.handleError<any>('editObra'))
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

  uploadFile(formData){
    return this._httpClient.post<any>(environment.apiManager + `upload-file`, formData)
    .pipe(
      tap((result) => {
        return result;
      }),
      catchError(this.error.handleError<any>('uploadFile'))
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

  addObra(obra: any): Observable<any> {
    return this._httpClient.post<any>(environment.apiManager + 'obras', obra)
      .pipe(
        tap((result) => {
          this._obras.next([...(this._empreendimentos.value || []), result.data]);
          this._obra.next(result.data);
        }),
        catchError(this.error.handleError<any>('addObra'))
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
