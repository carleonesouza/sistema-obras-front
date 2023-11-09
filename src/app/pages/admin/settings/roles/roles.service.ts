import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Usuario } from 'app/models/usuario';
import { Perfil } from 'app/models/perfil';

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

    atualizaRole(role: Perfil, roleId: string): Observable<any> {
      return this._httpClient.put<any>(environment.apiManager + 'tipo-usuarios/' + roleId, role)
        .pipe(
          tap((result) => {
            // Update the roles list after a successful update
            const updatedRoles = this._roles.value || [];
            const updatedRoleIndex = updatedRoles.findIndex((r) => r.id === roleId);
            if (updatedRoleIndex !== -1) {
              updatedRoles[updatedRoleIndex] = result?.data;
            }
            this._roles.next(updatedRoles);
          }),
          catchError(this.error.handleError<any>('atualizaRole'))
        );
    }

    addRoles(role: Perfil): Observable<any> {
      return this._httpClient.post<any>(environment.apiManager + 'tipo-usuarios/', role)
        .pipe(
          tap((newRole) => {
            // Update the roles list after adding a new role
            const updatedRoles = this._roles.value || [];
            updatedRoles.push(newRole.data);
            this._roles.next(updatedRoles);
          }),
          catchError(this.error.handleError<any>('addRoles'))
        );
    }

    deleteRole(role: Perfil): Observable<void> {
      return this._httpClient.delete<void>(environment.apiManager + 'tipo-usuarios/' + role.id, )
        .pipe(
          tap(() => {
            // Update the roles list after successful deletion
            const updatedRoles = this._roles.value || [];
            const updatedRolesIndex = updatedRoles.findIndex((r) => r.id === role.id);
            if (updatedRolesIndex !== -1) {
              updatedRoles.splice(updatedRolesIndex, 1);
              this._roles.next(updatedRoles);
            }
          }),
          catchError(this.error.handleError<void>('deleteRole'))
        );
    }
}
