import { TestBed } from '@angular/core/testing';

import { AuthMockService } from './auth-mock.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NGXLogger} from "ngx-logger";
import {NGXLoggerMock} from "ngx-logger/testing";

describe('AuthMockService', () => {
  let logger;
  beforeEach(() => {
    logger = NGXLoggerMock;
    TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule],
            providers: [
                {provide: NGXLogger, useValue: logger}]
  })});

  it('should be created', () => {
    const service: AuthMockService = TestBed.get(AuthMockService);
    expect(service).toBeTruthy();
  });
});
