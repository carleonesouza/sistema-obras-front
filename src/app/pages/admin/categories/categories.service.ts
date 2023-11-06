import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from 'app/models/categoria';
import { Usuario } from 'app/models/usuario';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap, catchError, take, switchMap, map, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _category: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  get categories$(): Observable<any[]> {
    return this._categories.asObservable();
  }

  get category$(): Observable<any> {
    return this._category.asObservable();
  }


  getAllCategories() {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.get<any[]>(environment.apiManager + 'categories/all/'+_id)
      .pipe(
        tap((result) => {
          let categories = result;
          categories = categories.sort((a, b) => a?.name.localeCompare(b?.name));
          this._categories.next(categories);
        }),
        catchError(this.error.handleError<any[]>('getAllCategories'))
      );
  }


  getCategorytById(id: string): Observable<any> {
      return this._httpClient.get<any>(environment.apiManager + 'categories/'+id)
      .pipe(
        tap((result) => {
          this._category.next(result);
        }),
        catchError(this.error.handleError<any>('getCategorytById'))
      );
  }


  editCategory(category: Categoria): Observable<any> {
    return this.categories$.pipe(
      take(1),
      switchMap(categories => this._httpClient.put<any>(environment.apiManager + 'categories/'+category._id, category)
        .pipe(
          map((updateCategory) => {

            // Find the index of the updated categorie
            const index = categories.findIndex(item => item.id === category._id);

            // Update the product
            categories[index] = updateCategory;

            // Update the products
            this._categories.next(categories);

            // Return the updated product
            return updateCategory;
          }),
          switchMap(updateCategory => this.category$.pipe(
            take(1),
            filter(item => item && item._id === category._id),
            tap(() => {
              // Update the product if it's selected
              this._category.next(updateCategory);

              // Return the product
              return updateCategory;
            })
          )),
          catchError(this.error.handleError<any>('editCategory'))
        ))
    );
  }



  addCategory(category: Categoria): Observable<any> {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.post(environment.apiManager + 'categories/'+_id, category)
      .pipe(
        tap(result => this._category.next(result)),
        catchError(this.error.handleError<any>('addCategory'))
      );
  }

  deleteCategory(category: Categoria): Observable<any> {
    return this._httpClient.delete(environment.apiManager + 'categories/'+category._id)
      .pipe(
        tap(),
        catchError(this.error.handleError<any>('deleteCategory'))
      );
  }

}
