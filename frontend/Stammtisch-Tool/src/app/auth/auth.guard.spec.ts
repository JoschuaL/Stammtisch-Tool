import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import {NGXLogger} from "ngx-logger";
import {NGXLoggerMock} from "ngx-logger/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {IonicStorageModule, Storage} from "@ionic/storage";


describe('AuthGuard', () => {
  let logger;
  beforeEach(() => {
    logger = NGXLoggerMock;
    TestBed.configureTestingModule({
      imports: [ IonicStorageModule.forRoot(),HttpClientTestingModule, RouterTestingModule],
      providers: [AuthGuard, {provide: NGXLogger, useValue: logger}]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
