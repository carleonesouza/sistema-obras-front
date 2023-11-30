import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsersService } from '../admin/settings/users/users.service';



@Injectable({
  providedIn: 'root'
})

export class ProfileResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _userService: UsersService,
        private _router: Router,
    ) {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        if (route.paramMap.get('id') !== 'add') {
            return this._userService.getUserById(route.paramMap.get('id'))
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
