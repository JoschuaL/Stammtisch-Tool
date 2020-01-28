import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportFilesystemService} from '../report/report-filesystem.service';
import {Report, ReportSummary, unsubmittedId} from '../report/report';
import {NGXLogger} from 'ngx-logger';
import {AlertController, LoadingController} from '@ionic/angular';
import {ReportDatabaseService} from '../report/report-database.service';
import {Storage} from '@ionic/storage';
import {Plugins} from '@capacitor/core';
import sort from 'fast-sort';

const {Modals} = Plugins;


enum Scope {
    own,
    global
}

@Component({
    selector: 'app-status',
    templateUrl: './status.page.html',
    styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {

    public Scope = Scope;
    connected = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private reportFilesystem: ReportFilesystemService,
        private logger: NGXLogger,
        private loadingController: LoadingController,
        private reportDatabase: ReportDatabaseService,
        private alertController: AlertController,
        private storage: Storage
    ) {
    }


    reports: ReportSummary[] = [];
    scope: Scope = Scope.own;

    ngOnInit() {
        this.route.paramMap.subscribe(
            params => {
                const val = params.get('scope');
                this.scope = val === 'own' ? Scope.own : Scope.global;
                this.loadReports();
            }
        );
    }

    setConnection(connected: boolean) {
        this.connected = connected;
    }

    /**
     * Loads all local reports, or if server reports are requested
     * Uses smart caching to reduce the amount of requests to the server
     */
    async loadReports() {
        const loading = await this.loadingController.create({
            message: 'loading reports'
        });
        await loading.present();
        if (this.scope === Scope.own) {
            const reports = await this.reportFilesystem.getOwnReportsList();
            sort(reports).desc(
                r => Date.parse(r.meeting_date)
            );
            this.reports = reports;
        } else {
            try {
                let reportList = await this.reportFilesystem.getGlobalReportsList();
                sort(reportList).desc(
                    r => Date.parse(r.meeting_date)
                );
                // We need a starting point
                if (reportList.length < 1) {
                    const initial = await this.reportDatabase.fetchLatest();
                    const summary: ReportSummary = {
                        created_date: initial.report_created_date,
                        id: initial.id,
                        location: initial.location,
                        meeting_date: initial.meeting_date,
                        saved_date: initial.report_send_date

                    };
                    reportList = await this.reportFilesystem.addGlobalReportSummary(summary);
                }
                // to saturate the initial view
                if (reportList.length < 100) {
                    const additionalReports = await this.reportDatabase.getPrevN(reportList[reportList.length - 1].meeting_date, '', 1000);
                    reportList = await this.reportFilesystem.addGlobalReportSummaries(additionalReports);
                }
                // to uphold all invariants
                sort(reportList).desc(
                    r => Date.parse(r.meeting_date)
                );
                this.reports = await this.fetchUpdates(reportList);
            } catch (e) {
                this.logger.error(e);
            }


        }
        await loading.dismiss();
        this.logger.debug(this.reports);
    }

    /**
     * Fetches newer reports
     * @param ev event to dismiss
     */
    async refresh(ev: any) {
        this.reports = await this.fetchUpdates(this.reports);
        ev.target.complete();
    }

    /**
     * Gets reports that are newer than the current newest, and also gets updates since the last connection
     * @param currentList current list of reports, needs to be sorted by meeting_date
     * in descending order (so index 0 is the most recent report)
     */
    async fetchUpdates(currentList: ReportSummary[]): Promise<ReportSummary[]> {
        if (currentList.length < 1) {
            return currentList;
        }
        let reportList = currentList;
        const newestReport = reportList[0];
        const newestDate = Date.parse(newestReport.meeting_date);
        const oldestReport = reportList[reportList.length - 1];
        const oldestDate = Date.parse(oldestReport.meeting_date);
        // most current by date saved on the database
        let mostCurrentReport = reportList[0];
        let mostCurrentDate = Date.parse(newestReport.saved_date);
        if (isNaN(mostCurrentDate)) {
            mostCurrentDate = 0;
        }
        for (const report of reportList) {
            let repdate = Date.parse(report.saved_date);
            if (isNaN(repdate)) {
                repdate = 0;
            }
            if ((mostCurrentDate - repdate) < 0) {
                mostCurrentReport = report;
                mostCurrentDate = repdate;
            }
        }
        // to get changes like a change in date
        let updates = await this.reportDatabase.getUpdates(new Date(mostCurrentDate).toISOString());
        // otherwise we might get jumps in dates when an reports date is changed
        updates = updates.filter(rep => {
            const date = Date.parse(rep.meeting_date);
            return newestDate >= date && oldestDate <= date;
        });
        await this.reportFilesystem.addGlobalReportSummaries(updates);
        // get newest reports
        const newer = await this.reportDatabase.getNextN(newestReport.meeting_date, '', 10000);
        await this.reportFilesystem.addGlobalReportSummaries(newer);
        // in case the date of an originally out-of-range report is changed to be in range
        reportList = await this.reportFilesystem.purgeDuplicateIds();
        return reportList;
    }

    async loadOlderReports(ev: any) {
        const older = await this.reportDatabase.getPrevN(this.reports[this.reports.length - 1].meeting_date, '', 1000);
        this.reports = await this.reportFilesystem.addGlobalReportSummaries(older);
        ev.target.complete();
    }

    mapIdToColor(id: number): string {
        if (id === unsubmittedId) {
            return 'warning';
        } else {
            return 'success';
        }
    }

    mapIdToIcon(id: number): string {
        if (id === unsubmittedId) {
            return 'alert';
        } else {
            return 'checkmark-circle-outline';
        }
    }

    async editReport(reportSum: ReportSummary) {
        if (!this.connected && this.scope === Scope.global) {
            await Modals.alert({
                title: 'You are offline',
                message: 'You are offline. Editing is disabled until you reconnect'
            });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Loading Report'
        });

        await loading.present();
        let report: Report;
        if (this.scope === Scope.own) {
            report = await this.reportFilesystem.getSavedReport(reportSum.location, new Date(reportSum.meeting_date), reportSum.id);
        } else {
            try {
                if (reportSum.id === unsubmittedId) {
                    report = await this.reportDatabase.fetch(reportSum.location, reportSum.meeting_date);
                } else {
                    report = await this.reportDatabase.fetchById(reportSum.id);
                }

                if (!report) {
                    throw new Error('unknown_report');
                }
            } catch (e) {
                await loading.dismiss();
                if (e instanceof Error && e.message === 'unknown_report' || e === 'unknown_report') {
                    await Modals.alert({
                        title: 'No report found',
                        message: 'Sorry, we couldn\'t find a report at this location and date in the database',

                    });

                } else {
                    await Modals.alert({
                        title: 'Error',
                        message: 'Something went wrong while downloading the report'
                    });
                    this.logger.error(e);
                }
                return;
            }
        }
        await this.storage.set('edit_report', report);
        await loading.dismiss();
        await this.router.navigate(['/edit']);


    }

}
