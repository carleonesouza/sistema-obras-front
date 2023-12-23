import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private _logs: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }

  get logs$(): Observable<any[]> {
    return this._logs.asObservable();
  }

  getLogs() {
    return this._httpClient.get<any>(environment.apiManager + 'logs')
      .pipe(
        tap((result) => {       
          this._logs.next(result);
        }),
        catchError(this.error.handleError<any>('getLogs'))
      );
  }
}
