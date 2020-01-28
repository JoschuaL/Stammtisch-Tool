import {Injectable} from '@angular/core';
import {Report, ReportSummary, unsubmittedId} from './report';
import {NGXLogger} from 'ngx-logger';
import {Storage} from '@ionic/storage';
import sort from 'fast-sort';

@Injectable({
    providedIn: 'root'
})
export class ReportFilesystemService {
    constructor(private logger: NGXLogger, private storage: Storage) {
    }

    // for when we need to save an actual report
    private buildReportIndexFromReport(report: Report): string {
        const date = new Date(report.meeting_date);
        return this.buildReportIndex(report.location, date, report.id);
    }

    // for when we only have location and date
    private buildReportIndex(location: string, date: Date, id: number): string {
        return location + '-' +
            date.getFullYear() + '-' +
            date.getMonth() + '-' +
            date.getDay() + '-' +
            id;
    }

    /**
     * For Sorting
     */
    private DateComparator(a: string, b: string): number {
        const x = Date.parse(a);
        const y = Date.parse(b);
        return x - y;
    }

    /**
     * For equivalence
     */
    private compareDateComponents(x: string, y: string): boolean {
        const a = new Date(x);
        const b = new Date(y);
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDay() === b.getDay();
    }

    /**
     * Inserts a report in a collection, either replacing an old one if present
     * or inserting at the position in order of meeting date
     * @param reports the collection in which to insert
     * @param report the report to insert
     */
    private async insertReport(reports: ReportSummary[], report: Report): Promise<ReportSummary[]> {
        // check Presence
        const reportSummary: ReportSummary = {
            location: report.location,
            id: report.id,
            meeting_date: report.meeting_date,
            created_date: report.report_created_date,
            saved_date: report.report_send_date
        };
        return this.insertReportSummary(reports, reportSummary);
    }

    private async insertReportSummary(reports: ReportSummary[], summary: ReportSummary): Promise<ReportSummary[]> {
        // check Presence
        let index;
        if (summary.id === unsubmittedId) {
            index = reports.findIndex(r =>
                this.compareDateComponents(r.meeting_date, summary.meeting_date) &&
                r.location === summary.location &&
                r.id === unsubmittedId
            );
        } else {
            index = reports.findIndex(r => r.id === summary.id);
        }


        if (
            index === -1 ||
            // only overwrite older reports or reports recieved more recently by the database
            (reports[index].saved_date && summary.saved_date && this.DateComparator(reports[index].saved_date, summary.saved_date) < 0) ||
            this.DateComparator(reports[index].created_date, summary.created_date) < 0
        ) {
            if (index === -1) {
                // insert at correct date. This way we don't need to sort most of the time
                const i = reports.findIndex(r => this.DateComparator(r.meeting_date, summary.meeting_date) < 0);
                if (index === -1) {
                    reports.push(summary);
                } else {
                    reports.splice(i, 0, summary);
                }
            } else {
                reports[index] = summary;
            }
        }
        return reports;
    }

    /**
     * Only check locally saved
     */
    async checkExists(report: Report): Promise<boolean> {
        let ownReports: ReportSummary[] = await this.storage.get('own_reports');
        if (!ownReports) {
            ownReports = [];
        }
        const indexOwn = ownReports.findIndex(r =>
            this.compareDateComponents(r.meeting_date, report.meeting_date) &&
            r.location === report.location &&
            r.id === unsubmittedId
        );

        return indexOwn !== -1;
    }

    /**
     * Will override if not previously checked with @checkExists and new report is younger than present report and there ids match
     */
    async addOwnReport(report: Report) {
        let reports: ReportSummary[] = await this.storage.get('own_reports');
        if (!reports) {
            reports = [];
        }
        reports = await this.insertReport(reports, report);
        await this.storage.set('own_reports', reports);
        await this.storage.set(
            this.buildReportIndexFromReport(report),
            report
        );
    }

    /**
     * Same functionality as @addOwnReport just for global
     */
    async addGlobalReport(report: Report) {
        let globalReports: ReportSummary[] = await this.storage.get('global_reports');
        let ownReports: ReportSummary[] = await this.storage.get('own_reports');
        if (!globalReports) {
            globalReports = [];
        }
        if (!ownReports) {
            ownReports = [];
        }
        this.insertReport(globalReports, report);
        const indexOwn = ownReports.findIndex(r =>
            r.id === report.id
        );

        await this.storage.set('global_reports', globalReports);
        if (indexOwn === -1 ||
            this.DateComparator(ownReports[indexOwn].created_date, report.report_created_date) < 0 ||
            (ownReports[indexOwn].saved_date && report.report_send_date &&
                this.DateComparator(ownReports[indexOwn].saved_date, report.report_send_date) < 0)
        ) {
            await this.storage.set(
                this.buildReportIndexFromReport(report),
                report
            );
        }
    }

    async addGlobalReportSummary(summary: ReportSummary): Promise<ReportSummary[]> {
        let reports: ReportSummary[] = await this.storage.get('global_reports');
        if (!reports) {
            reports = [];
        }
        reports = await this.insertReportSummary(reports, summary);
        await this.storage.set('global_reports', reports);
        return reports;
    }

    async addGlobalReportSummaries(summarys: ReportSummary[]): Promise<ReportSummary[]> {

        let reports: ReportSummary[] = await this.storage.get('global_reports');
        if (!reports) {
            reports = [];
        }
        if (summarys.length < 1) {
            return reports;
        }
        for (const summary of summarys) {
            reports = await this.insertReportSummary(reports, summary);
        }
        await this.storage.set('global_reports', reports);
        return reports;
    }

    async deleteOwnReport(report: Report) {
        let reports: ReportSummary[] = await this.storage.get('own_reports');
        if (!reports) {
            reports = [];
        }
        let index;
        if (report.id !== unsubmittedId) {
            index = reports.findIndex(r => r.id === report.id);
        } else {
            index = reports.findIndex(r =>
                this.compareDateComponents(r.meeting_date, report.meeting_date) &&
                r.location === report.location &&
                r.id === unsubmittedId
            );
        }
        if (index !== -1) {
            reports.splice(index, 1);
            await this.storage.set('own_reports', reports);
            await this.storage.remove(
                this.buildReportIndexFromReport(report)
            );
        }
    }

    async purgeDuplicateIds(): Promise<ReportSummary[]> {
        let reports: ReportSummary[] = await this.getGlobalReportsList();
        sort(reports).desc(r => Date.parse(r.saved_date));
        const uniqueIdMap = new Map();
        for (const report of reports) {
            uniqueIdMap.set(report.id, report);
        }
        reports = Array.from(uniqueIdMap.values());
        sort(reports).desc(r => Date.parse(r.meeting_date));
        await this.storage.set('global_reports', reports);
        return reports;
    }

    async getOwnReportsList(): Promise<ReportSummary[]> {
        let reports: ReportSummary[] = await this.storage.get('own_reports');
        if (!reports) {
            reports = [];
        }
        return reports;
    }

    async getGlobalReportsList(): Promise<ReportSummary[]> {
        let reports: ReportSummary[] = await this.storage.get('global_reports');
        if (!reports) {
            reports = [];
        }
        return reports;
    }

    async getSavedReport(location: string, date: Date, id: number): Promise<Report> {
        const rep = await this.storage.get(this.buildReportIndex(location, date, id));
        return rep;
    }

    async getStatusNumbers(): Promise<number> {
        const reports = await this.getOwnReportsList();
        let unsubmitted = 0;
        for (const rep of reports) {
            if (rep.id === unsubmittedId) {
                unsubmitted++;
            }
        }
        return unsubmitted;
    }

    async getUnsubmittedReports(): Promise<Report[]> {
        const reports: ReportSummary[] = await this.getOwnReportsList();
        const unsubmitted: ReportSummary[] = reports.filter(r => r.id === unsubmittedId);
        const actualReports: Report[] = await Promise.all(
            unsubmitted.map(rs => this.getSavedReport(rs.location, new Date(rs.meeting_date), unsubmittedId))
        );
        return actualReports;
    }


}
