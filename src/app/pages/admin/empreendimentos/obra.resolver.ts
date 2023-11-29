import { ActivatedRouteSnapshot, Resolve, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { EmpreendimentosService } from './empreendimentos.service';
import { Observable, catchError, throwError } from 'rxjs';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ObrasResolver implements Resolve<boolean> {

  constructor(private _empreendimentosService: EmpreendimentosService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._empreendimentosService.getObras();
  }
}



@Injectable({
  providedIn: 'root'
})

export class ObraResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _empreendimentosService: EmpreendimentosService,
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
            return this._empreendimentosService.getObra(route.paramMap.get('id'))
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

