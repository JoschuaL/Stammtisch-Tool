import { TestBed } from '@angular/core/testing';

import { AuthServerService } from './auth-server.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AuthService} from "./auth.service";

import { NGXLoggerMock } from "ngx-logger/testing";
import { NGXLogger } from "ngx-logger";
import {inject} from "@angular/core";
import {loginUrl} from "../urls";

describe('AuthServerService', () => {
  let service : AuthServerService;
  let AuthService : AuthService;
  let logger;

  beforeEach(() => {
    logger = NGXLoggerMock;
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],

      providers: [
          {provide: NGXLogger, useValue: logger}]
  })});

  it('should be created', () => {
    const service: AuthServerService = TestBed.get(AuthServerService);
    expect(service).toBeTruthy();
  });
  it('Authenticate should be created', () => {
    const service: AuthServerService = TestBed.get(AuthServerService);
    expect(service.authenticate).toBeTruthy();
    expect(service.authenticate.toString).toBeTruthy();
  });
});





