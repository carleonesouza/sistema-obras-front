import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'app/models/usuario';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _user: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, public dialog: MatDialog,
    private error: HandleError, public _snackBar: MatSnackBar) { }



  get user$(): Observable<any> {
    return this._user.asObservable();
  }

  get users$(): Observable<any[]> {
    return this._users.asObservable();
  }

  getAllUsers(first = 1, last= 20): Observable<any[]> {
   
    return this._httpClient.get<any>(environment.apiManager + 'usuarios' )
      .pipe(
        tap((result) => {   
          let data = result?.data;    
          const users = data;
          this._users.next(users);
        }),
        catchError(this.error.handleError<any>('getAllUsers'))
      );
  }

  getUserById(id): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'usuarios/'+id)
      .pipe(
        tap((result) => {
          this._user.next(result?.data);
        }),
        catchError(this.error.handleError<any>('getUserById'))
      );
  }


  addUser(usuarioCliente): Observable<any> {
    const { _id } = new Usuario(JSON.parse(localStorage.getItem('user')));
    return this._httpClient.post(environment.apiManager + 'usuarios', usuarioCliente)
      .pipe(
        tap((result) => {
          this._user.next(result);
        }),
        catchError(this.error.handleError<any>('addUsuario'))
      );
  }

  removeUser(userId): Observable<any> {
      return this._httpClient.delete(environment.apiManager + 'usuarios'+userId)
        .pipe(
          tap((result) => {
            this._snackBar.open('Usuário Removido com Sucesso', 'Fechar', {
              duration: 3000
            });
          }),
          catchError(this.error.handleError<any>('removeUser'))
        );
  }

}
