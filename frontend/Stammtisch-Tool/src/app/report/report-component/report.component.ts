import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Report, unsubmittedId } from '../report';
import { Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { ReportFilesystemService } from '../report-filesystem.service';
import { ReportDatabaseService } from '../report-database.service';
import { DatePipe } from '@angular/common';

const { Modals } = Plugins;


@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, OnDestroy, OnChanges {
    /**
     * The current location we're writing a report for
     */
    @Input() location: string;
    /**
     * For filling contents of an report for editing
     */
    @Input() prefill: Report;
    /**
     * For refreshing the number of failed reports
     */
    @Input() refreshCallback: () => Promise<void>;

    reportForm = new FormGroup({
        date: new FormControl('', [Validators.required, this.notFutureValidator]),
        startTime: new FormControl('', Validators.required),
        endTime: new FormControl('', Validators.required),
        organisersM: new FormControl('', [Validators.required, this.positiveValidator]),
        organisersF: new FormControl('', [Validators.required, this.positiveValidator]),
        organisersX: new FormControl('', [Validators.required, this.positiveValidator]),
        regularAttendeesM: new FormControl('', [Validators.required, this.positiveValidator]),
        regularAttendeesF: new FormControl('', [Validators.required, this.positiveValidator]),
        regularAttendeesX: new FormControl('', [Validators.required, this.positiveValidator]),
        newAttendeesM: new FormControl('', [Validators.required, this.positiveValidator]),
        newAttendeesF: new FormControl('', [Validators.required, this.positiveValidator]),
        newAttendeesX: new FormControl('', [Validators.required, this.positiveValidator]),
        topics: new FormControl('', Validators.required),
        notes: new FormControl('')
    });

    controls: Array<[string, AbstractControl]> = Object.keys(this.reportForm.controls)
        .filter(value => this.reportForm.controls.hasOwnProperty(value))
        .map(value => [value, this.reportForm.get(value)]);


    private reportFormSubscription: Subscription;

    constructor(
        private logger: NGXLogger,
        private storage: Storage,
        private loadingController: LoadingController,
        private reportFilesystem: ReportFilesystemService,
        private reportSender: ReportDatabaseService,
        private datePipe: DatePipe
    ) {

    }

    /**
     * Validates that an entered number in a control is >= 0
     * @param control the control to validate, typically an input for the number of attendees
     */
    positiveValidator(control: AbstractControl): ValidationErrors | null {
        return parseInt(control.value, 10) >= 0 ? null : { error: 'negative value' };
    }

    /**
     * Validate the date in a control to not be in the future
     * @param control the control to validate, typically the date input for the meetup date
     */
    notFutureValidator(control: AbstractControl): ValidationErrors | null {
        const date = Date.parse(control.value);
        if ((date - Date.now()) > 0) {
            return { error: 'Date is in future' };
        } else {
            return null;
        }
    }


    ngOnInit() {
        this.prepareForm();
        this.reportFormSubscription = this.reportForm.valueChanges
            .pipe(
                // only emit after 500 ms of inactivity
                debounceTime(500)
            ).subscribe(
                value => this.backupForm(value)
            );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.prepareForm();
    }

    /**
     * Fills the form either form backup or from the report that needs to be edited
     */
    prepareForm() {
        // only load backup if we're not editing
        if (this.location != null &&
            this.location !== '' &&
            this.prefill == null) {
            this.restoreBackup(this.location);
        }
        // only try to fill from the editing report if there actually is one
        if (this.prefill != null) {
            this.fillFromReport(this.prefill);
        }
    }

    /**
     * Maps the fields of a report to their corresponding controls in the report form
     * @param report the report to put into the form
     */
    fillFromReport(report: Report) {
        const value = {
            date: report.meeting_date,
            startTime: report.start_time,
            endTime: report.end_time,
            organisersM: report.male_organisers,
            organisersF: report.female_organisers,
            organisersX: report.diverse_organisers,
            regularAttendeesM: report.male_regular_attendees,
            regularAttendeesF: report.female_regular_attendees,
            regularAttendeesX: report.diverse_regular_attendees,
            newAttendeesM: report.male_new_attendees,
            newAttendeesF: report.female_new_attendees,
            newAttendeesX: report.diverse_new_attendees,
            topics: report.topics,
            notes: report.notes
        };
        this.reportForm.setValue(value);
    }

    /**
     * Restore a the previous state of a report in the form
     * @param loc the location for which we want to restore the previous state
     */
    restoreBackup(loc: string): void {
        if (!loc || loc === '') {
            return;
        }
        this.storage.get(loc + '-form_backup').then(
            value => {
                if (value && value !== '') {
                    this.reportForm.reset();
                    const backupReport = JSON.parse(value);
                    this.logger.debug(backupReport);
                    this.reportForm.setValue(backupReport);
                } else {
                    // no backup, so clear and prefill date, end time and start time
                    this.reportForm.reset();
                    this.reportForm.get('date').setValue(new Date().toISOString());
                    this.reportForm.get('endTime').setValue(new Date().toISOString());
                    this.storage.get(this.location + '-start_time')
                        .then(
                            time => {
                                if (time) {
                                    this.reportForm.get('startTime').setValue(time);
                                }
                            },
                            err => this.logger.error(err)
                        );
                }
            },
            err => this.logger.error(err)
        );


    }

    ngOnDestroy(): void {
        if (this.reportFormSubscription) {
            this.reportFormSubscription.unsubscribe();
        }

    }

    /**
     * Save current form state persistently as a backup. Only 1 backup per location
     * @param formdata the data from the form
     */
    async backupForm(formdata: any) {
        if (this.reportForm.dirty) {
            this.logger.debug(formdata);
            await this.storage.set(this.location + '-form_backup', JSON.stringify(formdata));
        }
        if (this.reportForm.get('startTime').touched) {
            await this.storage.set(this.location + '-start_time', this.reportForm.get('startTime').value);
        }
    }

    private toISODateString(dateString: string): string {
        try {
            const date = new Date(dateString);
            return this.datePipe.transform(date, 'yyyy-MM-dd', null, 'de-DE');
        } catch (e) {
            return dateString;
        }

    }

    private toISOTimeString(timeString: string): string {
        try {
            const date = new Date(timeString);
            return this.datePipe.transform(date, 'HH:mm', null, 'de-DE');
        } catch (e) {
            return timeString;
        }

    }

    /**
     * Save the report locally, sending it to the server if possible.
     * If server could be reached, also set the id of the report to the respective id in the database.
     * If the report is edited, the previous state will be deleted
     * @param data the data from the form
     */
    async submitReport(data: any) {
        this.logger.debug(data);
        const repid = this.prefill == null ? unsubmittedId : this.prefill.id;
        const report: Report = {
            id: repid,
            meeting_date: this.toISODateString(data.date),
            start_time: this.toISOTimeString(data.startTime),
            end_time: this.toISOTimeString(data.endTime),
            location: this.location,
            male_organisers: parseInt(data.organisersM, 10),
            female_organisers: parseInt(data.organisersF, 10),
            diverse_organisers: parseInt(data.organisersX, 10),
            male_regular_attendees: parseInt(data.regularAttendeesM, 10),
            female_regular_attendees: parseInt(data.regularAttendeesF, 10),
            diverse_regular_attendees: parseInt(data.regularAttendeesX, 10),
            male_new_attendees: parseInt(data.newAttendeesM, 10),
            female_new_attendees: parseInt(data.newAttendeesF, 10),
            diverse_new_attendees: parseInt(data.newAttendeesX, 10),
            topics: data.topics,
            notes: data.notes,
            report_created_date: new Date().toISOString(),
            report_send_date: null
        };
        const loading = await this.loadingController.create({
            message: 'Sending Report'
        });

        await loading.present();
        const exists = await this.reportFilesystem.checkExists(report);
        if (exists) {
            await loading.dismiss();
            const cont = await Modals.confirm({
                title: 'Confirm Overwrite',
                message: 'There already is a report for this meetup. Continuing will overwrite the old report'
            });
            if (!cont || !cont.value) {
                return;
            }
        }
        const id = await this.sendReportToServer(report);
        if (report.id === unsubmittedId || (report.id !== id && id !== unsubmittedId)) {
            report.id = id;
        }
        if (this.prefill != null) {
            await this.reportFilesystem.deleteOwnReport(this.prefill);
        }
        await this.saveReportLocally(report);
        if (this.prefill == null) {
            await this.clearForm();
        }

        await this.refreshCallback();
        await loading.dismiss();


    }

    /**
     * Saves the report only locally
     * @param report the report to save
     */
    async saveReportLocally(report: Report) {
        await this.reportFilesystem.addOwnReport(report);
    }

    /**
     * Sends the report to the server
     * @param report the report to send
     */
    async sendReportToServer(report: Report): Promise<number> {
        try {
            const id = await this.reportSender.send(report);
            if (id == null) {
                return unsubmittedId;
            } else {
                return id;
            }
        } catch (e) {
            this.logger.debug(e);
            return unsubmittedId;
        }


    }

    /**
     * Resets this form and removes any backups for this location.
     * Refills date, start and endtime afterwards
     */
    async clearForm() {
        await this.storage.remove(this.location + '-form_backup');
        this.restoreBackup(this.location);
    }

}
