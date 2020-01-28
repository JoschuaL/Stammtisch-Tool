import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import {IonicStorageModule} from "@ionic/storage";
import {RouterTestingModule} from "@angular/router/testing";
import {NGXLogger} from "ngx-logger";
import {NGXLoggerMock} from "ngx-logger/testing";

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpTestingController } from "@angular/common/http/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[IonicStorageModule.forRoot(),RouterTestingModule, HttpClientTestingModule],
      providers: [
          {provide: NGXLogger, useClass: NGXLoggerMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
