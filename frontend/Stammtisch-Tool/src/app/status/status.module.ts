import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StatusPage } from './status.page';
import { ReportFilesystemService } from '../report/report-filesystem.service';
import { NGXLogger } from 'ngx-logger';
import { ReportDatabaseService } from '../report/report-database.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ReportModule } from '../report/report.module';

const routes: Routes = [
  {
    path: '',
    component: StatusPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReportModule
  ],
  declarations: [StatusPage],
  providers: [
    { provide: ReportFilesystemService, useClass: ReportFilesystemService, deps: [NGXLogger, Storage] },
    { provide: ReportDatabaseService, useClass: ReportDatabaseService, deps: [HttpClient, NGXLogger] },
    {provide: DatePipe, useClass: DatePipe, deps: []}
  ]
})
export class StatusPageModule { }
