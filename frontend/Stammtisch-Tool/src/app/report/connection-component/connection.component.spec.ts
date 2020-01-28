import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionComponent } from './connection.component';
import { NGXLoggerMock } from "ngx-logger/testing";
import { NGXLogger } from "ngx-logger";

describe('ConnectionComponent', () => {
  let component: ConnectionComponent;
  let fixture: ComponentFixture<ConnectionComponent>;
  let logger;
  beforeEach(async(() => {
    logger = NGXLoggerMock;
    TestBed.configureTestingModule({
      declarations: [ ConnectionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
          {provide: NGXLogger, useValue: logger}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
