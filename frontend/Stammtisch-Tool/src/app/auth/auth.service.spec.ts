import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

import {HttpClientTestingModule} from "@angular/common/http/testing";
import { NGXLoggerMock } from "ngx-logger/testing";
import { NGXLogger } from "ngx-logger";

describe('AuthService', () => {
  let logger;

  beforeEach(() => {
  logger = NGXLoggerMock;
  TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      providers: [
          {provide: NGXLogger, useValue: logger}]
  })
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
