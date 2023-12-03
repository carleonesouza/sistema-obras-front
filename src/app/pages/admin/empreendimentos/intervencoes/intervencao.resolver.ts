import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IntervencoesService } from './intervencoes.service';


@Injectable({
  providedIn: 'root'
})
export class IntervencoesResolver implements Resolve<boolean> {

  constructor(private _intervencaoService: IntervencoesService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._intervencaoService.getIntervencoes();
  }
}



@Injectable({
  providedIn: 'root'
})

export class IntervencaoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private  _intervencaoService: IntervencoesService,
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
            return this._intervencaoService.getIntervencaoById(route.paramMap.get('id'))
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


