import { Injectable } from '@angular/core';
import { AuthService} from './auth.service';
import { UserData } from './auth-response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
    providedIn: 'root'
})


/**
 * For mocking authentication when no server is used, like with ng serve
 */
export class AuthMockService implements AuthService {
    private LOCATIONS: Array<string> = [
        'Saarbrücken',
        'Köln',
        'Frankfurt',
        'Berlin',
        'Mainz'
    ];

    async logout(): Promise<boolean> {
        return true;
    }

    async check(): Promise<boolean> {
        return true;
    }



    /**
     * Mock implementation, always succeeds
     */
    async authenticate(username: string, password: string): Promise<UserData> {
        return new Observable<UserData>(subscriber => {
            if (username === '1' && password === '1') {
                subscriber.next({
                    name: username,
                    access_token: '177013',
                    locations: this.LOCATIONS
                });
            } else {
                subscriber.error('invalid username or password');
            }
            subscriber.complete();
        }).toPromise();
    }

    constructor(public http: HttpClient, public logger: NGXLogger) {
    }
}
