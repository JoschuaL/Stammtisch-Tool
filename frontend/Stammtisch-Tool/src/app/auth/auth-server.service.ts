import {Injectable} from '@angular/core';
import {AuthService, StatusResponse} from './auth.service';
import {AuthResponse, UserData} from './auth-response';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {checkUserUrl, loginUrl, logoutUrl} from '../urls';
import {map, retry, tap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';


/**
 * Headers fot the http connection with the backend
 * Feel free to add more headers on your own
 */
const httpOptions = {
    headers: new HttpHeaders({
        'Content-type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class AuthServerService implements AuthService {

    async logout(): Promise<boolean> {
        return this.http.get<StatusResponse>(logoutUrl, httpOptions)
            .pipe(
                retry(3),
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(value => value.status === 'success')
            ).toPromise();
    }

    check(): Promise<boolean> {
        return this.http.get<StatusResponse>(checkUserUrl, httpOptions)
            .pipe(
                retry(3),
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(value => value.status === 'success')
            ).toPromise();
    }

    /**
     * Actual implementation using the backend
     */
    async authenticate(username: string, password: string): Promise<UserData> {
        return this.http.post<AuthResponse>(loginUrl, JSON.stringify({username, password}), httpOptions)
            .pipe(
                // Automatically retry up to 3 times on error
                retry(3),
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(value => value.user_data)
                // Promises are more familiar to most developers,
                // but if you prefer observables, just remove this line and change the signature
            ).toPromise();
    }

    constructor(public http: HttpClient, public logger: NGXLogger) {
    }
}
