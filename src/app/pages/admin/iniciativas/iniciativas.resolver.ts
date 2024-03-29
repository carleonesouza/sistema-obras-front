import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { IniciativasService } from './iniciativas.service';


@Injectable({
  providedIn: 'root'
})
export class IniciativasResolver implements Resolve<boolean> {

  constructor(private _iniciativasService: IniciativasService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._iniciativasService.getAllIniciativas();
  }
}



@Injectable({
  providedIn: 'root'
})

export class IniciativaResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
      private _iniciativasService: IniciativasService,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        if (route.paramMap.get('id') !== 'add') {
            return this._iniciativasService.getIniciativatById(route.paramMap.get('id'))
                .pipe(
                    // Error here means the requested individuo is not available
                    catchError((error) => {

                        // Log the error
                        console.error('Resolve ', error);

                        // Get the parent url
                        const parentUrl = state.url.split('/').slice(0, -1).join('/');

                        // Navigate to there
                        this._router.navigateByUrl(parentUrl);

                        // Throw an error
                        return throwError(error);
                    })
                );
        }
    }
}


