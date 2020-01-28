import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPage } from './edit.page';
import {IonicStorageModule} from "@ionic/storage";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('EditPage', () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule,ReactiveFormsModule, RouterTestingModule,IonicStorageModule.forRoot(), HttpClientTestingModule],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
