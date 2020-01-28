import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPage } from './login.page';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NGXLoggerMock } from "ngx-logger/testing";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "../auth/auth.service";
import {IonicStorageModule, Storage} from "@ionic/storage";
import {
  FormControl,
  FormGroup,
  FormsModule, Validators} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import {
    IonicModule,
    Config, LoadingController,
} from "@ionic/angular";
import {fakeAsync} from "@angular/core/testing";
import {ActivatedRoute, Router, } from "@angular/router";
import {AuthMockService} from "../auth/auth-mock.service";
import { Account} from "../auth/account";

describe('LoginPage', () => {
  let route;
  let router;
  let auth;
  let logger;
  let loadingController;
  let storage;
  let account: Account;
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async(() => {
    route = ActivatedRoute;
    router = Router;
    auth = AuthMockService;
    logger = NGXLoggerMock;
    loadingController = LoadingController;
    storage = Storage;
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [IonicModule,FormsModule,ReactiveFormsModule, RouterTestingModule,IonicStorageModule.forRoot(), HttpClientTestingModule ],
      providers: [
          {provide: NGXLogger, useValue: logger},
          {provide: AuthService, useValue: auth},
          {provide: LoadingController, useValue: {create: () => Promise.resolve(),
                                                  dismiss: () => Promise.resolve()}},
          {provide: FormBuilder, useValue: formBuilder }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

    it('should create component', function () {
        expect(component).toBeTruthy();
    });


    beforeEach(async(() => {
        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;

        component.accountForm = formBuilder.group({
            username: '1',
            password: '1'
        });
        fixture.detectChanges();
    }));

     it('should return true if the form control is valid', () => {
       expect(fixture.componentInstance.accountForm).toBeTruthy();
     });


    it('check the username',() =>{
      expect(component.accountForm).toBeDefined();
    });

    it('connection to be truthy',() =>{
      expect(component.connection).toBeTruthy();
    });

});
