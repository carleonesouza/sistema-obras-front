import { HttpClient, HttpParams } from '@angular/common/http';
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
export class ObrasService {

  private _produtos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _produto: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _infraEstruturas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _infraEstrutura: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _obras: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _obra: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _bitolas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _bitola: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _sim_naos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _sim_nao: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _municipios: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _municipio: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _statues: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _status: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _tipo_dutos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _tipo_duto: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _funcao_estruturas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _funcao_estrutura: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _nivel_dutos: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _nivel_duto: BehaviorSubject<any | null> = new BehaviorSubject(null);


  private _estados: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }



  get produtos$(): Observable<any[]> {
    return this._produtos.asObservable();
  }

  get produto$(): Observable<any> {
    return this._produto.asObservable();
  }

  get bitolas$(): Observable<any[]> {
    return this._bitolas.asObservable();
  }

  get bitola$(): Observable<any> {
    return this._bitola.asObservable();
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

  get municipios$(): Observable<any[]> {
    return this._municipios.asObservable();
  }

  get municipio$(): Observable<any> {
    return this._municipio.asObservable();
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

  get sim_naos$(): Observable<any[]> {
    return this._sim_naos.asObservable();
  }

  get sim_nao$(): Observable<any> {
    return this._sim_nao.asObservable();
  }

  get tipo_dutos$(): Observable<any[]> {
    return this._tipo_dutos.asObservable();
  }

  get tipo_duto$(): Observable<any> {
    return this._tipo_duto.asObservable();
  }

  get funcao_estruturas$(): Observable<any[]> {
    return this._funcao_estruturas.asObservable();
  }

  get funcao_estrutura$(): Observable<any> {
    return this._funcao_estrutura.asObservable();
  }

  get nivel_dutos$(): Observable<any[]> {
    return this._nivel_dutos.asObservable();
  }

  get nivel_duto$(): Observable<any> {
    return this._nivel_duto.asObservable();
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
          this._statues.next(data);
        }),
        catchError(this.error.handleError<any>('getAllStatues'))
      );
  }

  getSimNaos() {
    return this._httpClient.get<any>(environment.apiManager + 'simnao')
      .pipe(
        tap((result) => {
          const data = result?.data;
          this._sim_naos.next(data);
        }),
        catchError(this.error.handleError<any>('getSimNaos'))
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


  getMunicipios(estado): Observable<any> {
    return this._httpClient.get<any>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
      .pipe(
        tap((result) => {
          const municipios = result;
          this._municipios.next(municipios);
        }),
        catchError(this.error.handleError<any>('getMunicipios'))
      );
  }

  getTipoDutos(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'tipo-dutos')
      .pipe(
        tap((result) => {
          const tipoDutos = result.data;
          this._tipo_dutos.next(tipoDutos);
        }),
        catchError(this.error.handleError<any>('getTipoDutos'))
      );
  }

  getFuncaoEstruturas(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'funcao-estruturas')
      .pipe(
        tap((result) => {
          const funcaoEstruturas = result.data;
          this._funcao_estruturas.next(funcaoEstruturas);
        }),
        catchError(this.error.handleError<any>('getFuncaoEstruturas'))
      );
  }

  getBitolas(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'bitolas')
      .pipe(
        tap((result) => {
          const bitolas = result.data;
          this._bitolas.next(bitolas);
        }),
        catchError(this.error.handleError<any>('getBitolas'))
      );
  }

  getNivelDutos(): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'nivel-dutos')
      .pipe(
        tap((result) => {
          const nivelDutos = result.data;
          this._nivel_dutos.next(nivelDutos);
        }),
        catchError(this.error.handleError<any>('getNivelDutos'))
      );
  }

  getObras(itemsPerPage = 10) {
    return this._httpClient.get<any>(`${environment.apiManager}obras`, {
      params: { itemsPerPage }
    })
      .pipe(
        tap((result) => {
          let obras = result.data;
          obras = obras.sort((a, b) => a.descricao.localeCompare(b.descricao));
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

  removeProduto(obra, produto) {
    return this._httpClient.put<any>(environment.apiManager + `obras/produto/${obra.id}`, produto)
      .pipe(
        tap((result) => {
          return result
        }),
        catchError(this.error.handleError<any>('removeProduto'))
      );
  }

  removeMunicipio(obra, municipio) {
    return this._httpClient.put<any>(environment.apiManager + `obras/municipio/${obra.id}`, municipio)
      .pipe(
        tap((result) => {
          return result
        }),
        catchError(this.error.handleError<any>('removeMunicipio'))
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


  uploadFile(formData) {
    return this._httpClient.post<any>(environment.apiManager + `upload-file`, formData, {
      reportProgress: true,
      observe: 'events'
    })
      .pipe(
        tap((result) => {
          return result;
        }),
        catchError(this.error.handleError<any>('uploadFile'))
      );
  }

  searchObra(tipo: string): Observable<any> {
    const params = new HttpParams().set('term', tipo); // 'term' is the query parameter name

    return this._httpClient.get<any>(`${environment.apiManager}search`, { params })
      .pipe(
        tap((obras) => {
          this._obras.next(obras.data);
        }),
        catchError(this.error.handleError<any>('searchObra'))
      );
  }


  addObra(obra: any): Observable<any> {
    return this._httpClient.post<any>(environment.apiManager + 'obras', obra)
      .pipe(
        tap((result) => {
          this._obras.next([...(this._obras.value || []), result.data]);
          this._obra.next(result.data);
        }),
        catchError(this.error.handleError<any>('addObra'))
      );
  }


}
