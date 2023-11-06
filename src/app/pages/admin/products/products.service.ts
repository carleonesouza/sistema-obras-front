import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Produto } from 'app/models/produto';
import { Usuario } from 'app/models/usuario';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap, tap, take, map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _products: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _category: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get products$(): Observable<any[]> {
    return this._products.asObservable();
  }

  get product$(): Observable<any> {
    return this._product.asObservable();
  }

  get categories$(): Observable<any[]> {
    return this._categories.asObservable();
  }

  get category$(): Observable<any> {
    return this._category.asObservable();
  }


  getAllProducts(page = 0, size = 10) {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.get<any[]>(environment.apiManager + 'products/all/'+_id, {params:{
      page, size
    }})
      .pipe(
        tap((result) => {
          let produtos = result;
          produtos = produtos.sort((a, b) => a?.name.localeCompare(b?.name));
          this._products.next(produtos);
        }),
        catchError(this.error.handleError<any[]>('getAllProducts'))
      );
  }


  getProductById(id): Observable<any> {
      return this._httpClient.get<any>(environment.apiManager + 'products/'+id)
      .pipe(
        tap((result) => {
          this._product.next(result);
        }),
        catchError(this.error.handleError<any>('getProductById'))
      );
  }


  getCategories(){
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.get<any[]>(environment.apiManager + 'categories/all/'+_id)
      .pipe(
        tap((result) => {
          let categories = result;
          categories = categories.sort((a, b) => a?.name.localeCompare(b?.name));
          this._categories.next(categories);
        }),
        catchError(this.error.handleError<any[]>('getAllCateroies'))
      );
  }

  editProduct(product: Produto): Observable<any> {
    return this.products$.pipe(
      take(1),
      switchMap(products => this._httpClient.put<any>(environment.apiManager + 'products/'+product._id, product)
        .pipe(
          map((updatedProduct) => {

            // Find the index of the updated product
            const index = products.findIndex(item => item.id === product._id);

            // Update the product
            products[index] = updatedProduct;

            // Update the products
            this._products.next(products);

            // Return the updated product
            return updatedProduct;
          }),
          switchMap(updatedProduct => this.product$.pipe(
            take(1),
            filter(item => item && item._id === product._id),
            tap(() => {
              // Update the product if it's selected
              this._product.next(updatedProduct);

              // Return the product
              return updatedProduct;
            })
          )),
          catchError(this.error.handleError<any>('editProduct'))
        ))
    );
  }

  deactivateActiveProduct(product: any): Observable<any>{
    return this._httpClient.patch(environment.apiManager + 'produtos/ativa-desativa', product)
    .pipe(
      catchError(this.error.handleError<any>('deactivateActiveProduct'))
    );
  }

  searchProductByContract(contratoId): Observable<any[]>{
      return this._httpClient.get<any[]>(environment.apiManager + 'produtos/busca-produtos-por-contrato', {params: contratoId})
      .pipe(
        tap((products) => {
          this._products.next(products);
        }),
        catchError(this.error.handleError<any>('searchProductByContract'))
      );
  }

  addProduct(product): Observable<any> {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.post(environment.apiManager + 'products/'+_id, product)
      .pipe(
        tap(result => this._product.next(result)),
        catchError(this.error.handleError<any>('addProduct'))
      );
  }

  deleteProduct(product: Produto): Observable<any> {
    return this._httpClient.delete(environment.apiManager + 'products/'+product._id)
      .pipe(
        tap(result => this._product.next(result)),
        catchError(this.error.handleError<any>('deleteProduct'))
      );
  }

}
