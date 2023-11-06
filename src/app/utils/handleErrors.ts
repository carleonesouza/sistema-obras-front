import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { Observable, of, throwError } from 'rxjs';

@Injectable()
export class HandleError {

  constructor(public dialog: MatDialog, private router: Router) { }

  handleError<T>(operation = 'operation', result?: T) {
    return (handle: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(handle); // log to console instead

      let errorMenssage = { message: 'Ocorreu um erro desconhecido!', status: 500, operation: operation };

      if (handle.status >= 500 && handle.status <= 599) {
        errorMenssage = { message: handle.error, status: handle.status, operation: operation };
        console.log(errorMenssage);

        this.router.navigate(['error-500']);
        this.dialog.open(ConfirmationDialogComponent, {
          width: 'auto',
          data: {
            title: 'Ocorreu um erro!', message: handle.error,
            confirm: false, recId: operation, status: handle.status
          },
        });
        return throwError(errorMenssage);
      }
      if (handle.status === 400 || handle.status === 403 ) {
        errorMenssage = { message: handle.error.message, status: handle.status, operation: operation };
        console.log(errorMenssage);

        this.dialog.open(ConfirmationDialogComponent, {
          width: 'auto',
          data: {
            title: 'Ocorreu um erro!', message: handle.error.message,
            confirm: false, recId: operation, status: handle.status
          },
        });
        return throwError(errorMenssage);
      } else if (handle.status === 401 || handle.status === 403) {
        errorMenssage = { message: handle.error.message, status: handle.status, operation: operation };
        console.log(errorMenssage);

        this.dialog.open(ConfirmationDialogComponent, {
          width: 'auto',
          data: {
            title: 'Ocorreu um erro!', message: 'Você não tem autorização ainda para acessar esse serviço!',
            confirm: false, recId: operation, status: handle.status
          },
        });
        return throwError(errorMenssage);
      } else if (handle.status === 404) {
        errorMenssage = { message: handle.error.message, status: handle.status, operation: operation };
        console.log(errorMenssage);
        //this.router.navigate(['404-not-found']);

        this.dialog.open(ConfirmationDialogComponent, {
          width: 'auto',
          data: {
            title: 'Ocorreu um erro!', message: handle.error.message,
            confirm: false, recId: operation, status: handle.status
          },
        });
        return throwError(errorMenssage);
      }else {
        errorMenssage = { message: handle.error, status: handle.status, operation: operation };

        this.dialog.open(ConfirmationDialogComponent, {
          width: 'auto',
          data: {
            title: 'Ocorreu um erro!', message: handle.error.message,
            confirm: false, recId: operation, status: handle.status
          },
        });
        return throwError(errorMenssage);
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
