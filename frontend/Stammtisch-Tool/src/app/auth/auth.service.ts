import { Injectable } from '@angular/core';
import { UserData } from './auth-response';
import { environment } from '../../environments/environment';
import { AuthServerService } from './auth-server.service';
import { AuthMockService } from './auth-mock.service';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

export interface StatusResponse {
  status: string;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  constructor(public http: HttpClient, public logger: NGXLogger) { }

  /**
   * Authenticate the User with the backend
   * @param username the name of the user
   * @param password the password of the user
   * @return The Users data, like available locations and authentication token
   */
  abstract async authenticate(username: string, password: string): Promise<UserData>;
  abstract async logout(): Promise<boolean>;
  abstract async check(): Promise<boolean>;
}

/**
 * Factory for the auth service to differentiate between the mock and production version
 * @param http injected http service
 */
export function authServiceFactory(http: HttpClient, logger: NGXLogger): AuthService {
  if (true) {
    return new AuthServerService(http, logger);
  } else {
    return new AuthMockService(http, logger);
  }
}
