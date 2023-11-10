import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmpreendimentosService } from './empreendimentos.service';


@Injectable({
  providedIn: 'root'
})
export class EmpreendimentosResolver implements Resolve<boolean> {

  constructor(private _EmpreendimentosService: EmpreendimentosService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._EmpreendimentosService.getAllEmpreendimentos();
  }
}



@Injectable({
  providedIn: 'root'
})

export class EmpreendimentoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _EmpreendimentosService: EmpreendimentosService,
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
            return this._EmpreendimentosService.getEmpreendimentoById(route.paramMap.get('id'))
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


