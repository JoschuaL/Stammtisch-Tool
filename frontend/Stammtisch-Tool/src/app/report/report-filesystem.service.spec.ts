import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule, LoadingController} from "@ionic/angular";
import {Report, ReportSummary, unsubmittedId} from './report';
import {ReportFilesystemService} from "./report-filesystem.service";
import {async} from "@angular/core/testing";
import { of } from "rxjs/index";
import { HttpClient, HttpErrorResponse} from "@angular/common/http";
import {HttpTestingController, HttpClientTestingModule} from "@angular/common/http/testing";
import {AuthMockService} from "../auth/auth-mock.service";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NGXLogger} from "ngx-logger";
import {NGXLoggerMock} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {IonicStorageModule, Storage} from "@ionic/storage";
import {AuthService} from "../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginPage} from "../login/login.page";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {inject} from "@angular/core";
describe('ReportFilesystemService', () => {
  let logger;
  let storage;
  let report: Report;
  let summary: ReportSummary[];
  let service: ReportFilesystemService;
  let fixture: ComponentFixture<ReportFilesystemService>;

  beforeEach(( )=> {
    logger = NGXLoggerMock;
    storage = IonicStorageModule;
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ HttpClientTestingModule, IonicStorageModule ],
      providers: [
          ReportFilesystemService,
          {provide: NGXLogger, useValue: logger},
          {provide: Storage, useValue: storage} ],
    });
    service = TestBed.get(ReportFilesystemService);
  });

  it('should have a service instance', () => {
    expect(service).toBeDefined();
  });

  it('Add Global Reports', () => {
    expect(service.addGlobalReport(report)).toBeDefined();
    });

  it('delete my Reports', () => {
    expect(service.deleteOwnReport(report)).toBeDefined();
    });
  it('Duplicate Ids', () => {
    expect(service.purgeDuplicateIds()).toBeDefined();
    });
  it('Get my report list', () => {
    expect(service.getOwnReportsList()).toBeDefined();
    });
  it('Get global report list', () => {
    expect(service.getGlobalReportsList()).toBeDefined();
    });
});

