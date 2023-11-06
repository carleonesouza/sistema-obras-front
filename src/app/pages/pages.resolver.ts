import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, catchError, of, throwError } from 'rxjs';
import { PagesService } from './pages.service';

@Injectable({
    providedIn: 'root'
})
export class PagesResolver implements Resolve<any> {
    /**
     * Constructor
     */

    constructor(private _authService: AuthService, private _router: Router, private _pagesService: PagesService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
        console.log(route);
        return of();

        // return this._authService.signIn(route)
        //     .pipe(
        //         // Error here means the requested individuo is not available
        //         catchError((error) => {

        //             // Log the error
        //             console.error('Resolve ', error);

        //             // Get the parent url
        //             const parentUrl = state.url.split('/').slice(0, -1).join('/');

        //             // Navigate to there
        //             this._router.navigateByUrl(parentUrl);

        //             // Throw an error
        //             return throwError(error);
        //         })
        //     );

    }
}


