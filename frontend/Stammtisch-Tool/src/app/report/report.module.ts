import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ReportComponent} from './report-component/report.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ReportFilesystemService} from './report-filesystem.service';
import {NGXLogger} from 'ngx-logger';
import {ReportDatabaseService} from './report-database.service';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {RetryComponent} from './retry/retry.component';
import {ControlErrorPipe} from './control-error.pipe';
import {ConnectionComponent} from './connection-component/connection.component';

@NgModule({
    declarations: [ReportComponent, RetryComponent, ControlErrorPipe, ConnectionComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
    ],
    exports: [ReportComponent, RetryComponent, ControlErrorPipe, ConnectionComponent],
    providers: [
        {provide: ReportFilesystemService, useClass: ReportFilesystemService, deps: [NGXLogger, Storage]},
        {provide: ReportDatabaseService, useClass: ReportDatabaseService, deps: [HttpClient, NGXLogger]},
        {provide: ControlErrorPipe, useClass: ControlErrorPipe, deps: [NGXLogger]},
        {provide: DatePipe, useClass: DatePipe, deps: []}
    ],
    entryComponents: [RetryComponent]
})
export class ReportModule {
}
