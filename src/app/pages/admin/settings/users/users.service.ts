import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'app/models/user';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _user: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(
    private _httpClient: HttpClient,
    public dialog: MatDialog,
    private error: HandleError,
    public _snackBar: MatSnackBar
  ) { }

  get user$(): Observable<any> {
    return this._user.asObservable();
  }

  get users$(): Observable<any[]> {
    return this._users.asObservable();
  }

  getAllUsers(first = 1, last = 20): Observable<any[]> {
    return this._httpClient.get<any>(environment.apiManager + 'usuarios').pipe(
      tap((result) => {
        const data = result?.data;
        const users = data;
        this._users.next(users);
      }),
      catchError(this.error.handleError<any>('getAllUsers'))
    );
  }

  getUserById(id): Observable<any> {
    return this._httpClient.get<any>(environment.apiManager + 'usuarios/' + id).pipe(
      tap((result) => {
        this._user.next(result?.data);
      }),
      catchError(this.error.handleError<any>('getUserById'))
    );
  }

  addUser(usuarioCliente): Observable<any> {
    return this._httpClient.post<any>(environment.apiManager + 'usuarios', usuarioCliente).pipe(
      tap((result) => {
        this._users.next([...(this._users.value || []), result.data]);
        this._user.next(result.data);
      }),
      catchError(this.error.handleError<any>('addUsuario'))
    );
  }

  updateUser(user: User): Observable<any> {
    return this._httpClient.put<any>(environment.apiManager + 'usuarios/' + user.id, user).pipe(
      tap((result) => {
        const updatedUsers = this._users.value || [];
        const userIndex = updatedUsers.findIndex((user) => user.id === user.id);
        if (userIndex !== -1) {
          updatedUsers[userIndex] = result.data;
          this._users.next(updatedUsers);
        }
        this._user.next(result.data);
      }),
      catchError(this.error.handleError<any>('updateUser'))
    );
  }

  removeUser(user: User): Observable<any> {
    return this._httpClient.delete<any>(environment.apiManager + 'usuarios/' + user.id, {
      body: user
    }).pipe(
      tap(() => {
        const updatedUsers = this._users.value || [];
        const userIndex = updatedUsers.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          updatedUsers.splice(userIndex, 1);
          this._users.next(updatedUsers);
        }
      }),
      catchError(this.error.handleError<void>('removeUser'))
    );
  }

}