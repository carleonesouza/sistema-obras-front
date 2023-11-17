/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, of, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { HandleError } from 'app/utils/handleErrors';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { User } from 'app/models/user';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _isLoggerIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private error: HandleError
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken');
    }

    get isLoggedIn$(): Observable<boolean> {
        return this._isLoggerIn.asObservable();
    };

    set isLoggerIn(value: any) {
        this._isLoggerIn.next(value);
    }

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return of();
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(id: string, user: User): Observable<any> {
        return this._httpClient.post(environment.apiManager + 'reset-pwd' + id, user).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;
                this.isLoggerIn = true;

                // Store the user on the user service
                this.user = response.user;
                localStorage.setItem('user', JSON.stringify(response.user));

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; senha: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(environment.apiManager + 'login', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;
                this.isLoggerIn = true;

                // Store the user on the user service
                this.user = response.user;
                localStorage.setItem('user', JSON.stringify(response.user));

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        if (this.accessToken) {
            // Set the authenticated flag to true
            this._authenticated = true;

            this.isLoggerIn = true;

            // Return true
            return of(true);
        } else {
            this._authenticated = false;

            this.isLoggerIn = false;

            // Return true
            return of(false);

        }

    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {

        // Return the observable
        return this._httpClient.post(environment.apiManager + 'logout', {})
            .pipe(
                tap((result) => {
                    console.log(result)
                    // Remove the access token from the local storage
                    localStorage.removeItem('accessToken');

                    // Remove the access user from the local storage
                    localStorage.removeItem('user');

                    // Set the authenticated flag to false
                    this._authenticated = false;

                    this.isLoggerIn = false;

                })
            );
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (!this._authenticated) {

            return of(false);
        }

        // Check the access token availability
        if (this.accessToken) {
            this.isLoggerIn = true;
            return of(true);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
