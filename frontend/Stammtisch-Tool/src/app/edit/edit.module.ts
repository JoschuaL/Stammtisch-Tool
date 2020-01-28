import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {EditPage} from './edit.page';
import {ReportModule} from '../report/report.module';
import {ReportFilesystemService} from '../report/report-filesystem.service';
import {NGXLogger} from 'ngx-logger';
import {Storage} from '@ionic/storage';
import {ReportDatabaseService} from '../report/report-database.service';
import {HttpClient} from '@angular/common/http';
import {ControlErrorPipe} from '../report/control-error.pipe';

const routes: Routes = [
    {
        path: '',
        component: EditPage
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
    declarations: [EditPage],
    providers: [
        {provide: ReportFilesystemService, useClass: ReportFilesystemService, deps: [NGXLogger, Storage]},
        {provide: ReportDatabaseService, useClass: ReportDatabaseService, deps: [HttpClient, NGXLogger]},
        {provide: ControlErrorPipe, useClass: ControlErrorPipe, deps: [NGXLogger]},
        {provide: DatePipe, useClass: DatePipe, deps: []}
    ]
})
export class EditPageModule {
}
