import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { AuthService, authServiceFactory } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ReportComponent } from '../report/report-component/report.component';
import { ReportModule } from '../report/report.module';
import { NGXLogger } from 'ngx-logger';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReportModule
  ],
  declarations: [LoginPage],
  providers: [{ provide: AuthService, useFactory: authServiceFactory, deps: [HttpClient, NGXLogger] }]
})
export class LoginPageModule { }
