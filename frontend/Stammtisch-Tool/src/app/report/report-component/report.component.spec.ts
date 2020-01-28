import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ControlErrorPipe} from "../control-error.pipe";
import {NGXLoggerMock} from "ngx-logger/testing";
import {NGXLogger} from "ngx-logger";
import {LoadingController} from "@ionic/angular";

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ ReactiveFormsModule ],
      providers: [
           LoadingController,
          ControlErrorPipe,
          {provide: NGXLogger, useClass: NGXLoggerMock}
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
