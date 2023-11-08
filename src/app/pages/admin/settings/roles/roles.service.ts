import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Usuario } from 'app/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private _role: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }



   get role$(): Observable<any> {
    return this._role.asObservable();
  }


  get roles$(): Observable<any[]> {
    return this._roles.asObservable();
  }


  getAllRoles(): Observable<any[]>{
    return this._httpClient.get<any>(environment.apiManager+'tipo-usuarios').
    pipe(
      delay(500),
      tap((result) => {
        const data  = result.data;
        this._roles.next(data);
      }),
      catchError(this.error.handleError<any>('getAllRoles'))
    );
  }


  getRoleById(roleId: string): Observable<any>
    {
        return this._httpClient.get<any>(environment.apiManager + 'tipo-usuarios/'+roleId)
        .pipe(
          tap((result) =>{
            const data  = result.data;
            this._role.next(data);
          }),
          catchError(this.error.handleError<any>('getRoleById'))
        );
    }

    ativaDesativaRole(role, roleId): Observable<any>{
      return this._httpClient.put(environment.apiManager +'tipo-usuarios/'+roleId, role)
      .pipe(
        tap((result) =>{
          console.log(result);
        }),
        catchError(this.error.handleError<any>('ativaDesativaRole'))
      );
    }



  addRoles(role): Observable<any>{
    return this._httpClient.post<any>(environment.apiManager+'tipo-usuarios/', role)
    .pipe(
      tap((newRole) => {

        this._role.next(newRole);

        return newRole;
      }),
      catchError(this.error.handleError<any>('addRoles'))
    );
  }
}
