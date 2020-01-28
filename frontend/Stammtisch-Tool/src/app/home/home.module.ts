import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { ReportFilesystemService } from '../report/report-filesystem.service';
import { NGXLogger } from 'ngx-logger';
import { Storage } from '@ionic/storage';
import { ReportModule } from '../report/report.module';
import { ReportDatabaseService } from '../report/report-database.service';
import { HttpClient } from '@angular/common/http';
import { AuthModule } from '../auth/auth.module';
import { ControlErrorPipe } from '../report/control-error.pipe';
import { AuthService, authServiceFactory } from '../auth/auth.service';

const routes: Routes = [
    {
        path: '',
        component: HomePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReportModule,
        AuthModule
    ],
    declarations: [HomePage],
    providers: [
        { provide: ReportFilesystemService, useClass: ReportFilesystemService, deps: [NGXLogger, Storage] },
        { provide: ReportDatabaseService, useClass: ReportDatabaseService, deps: [HttpClient, NGXLogger] },
        { provide: ControlErrorPipe, useClass: ControlErrorPipe, deps: [NGXLogger] },
        { provide: DatePipe, useClass: DatePipe, deps: [] },
        { provide: AuthService, useFactory: authServiceFactory, deps: [HttpClient, NGXLogger] }

    ]

})
export class HomePageModule {
}
