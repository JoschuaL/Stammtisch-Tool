import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPage } from './status.page';
import {RouterTestingModule} from "@angular/router/testing";
import {NGXLoggerMock} from "ngx-logger/testing";
import {AuthService} from "../auth/auth.service";
import {NGXLogger} from "ngx-logger";
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('StatusPage', () => {
  let component: StatusPage;
  let fixture: ComponentFixture<StatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule, HttpClientTestingModule, IonicStorageModule.forRoot()],
        providers: [
          {provide: NGXLogger, useClass: NGXLoggerMock}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
