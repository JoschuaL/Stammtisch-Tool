import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Report, ReportSummary } from './report';
import { throwError } from 'rxjs';
import { fetchByIdUrl, fetchLatestUrl, fetchReportUrl, getNextNUrl, getPreviousNUrl, getUpdatesUrl, sendReportUrl } from '../urls';
import { map, retry, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-type': 'application/json'
    })
};

interface SendResponse {
    status: string;
    error: string;
    report_id: number;
}

interface FetchResponse {
    status: string;
    error: string;
    report: Report;
}

interface RangeResponse {
    status: string;
    error: string;
    reports: ReportSummary[];
}


@Injectable({
    providedIn: 'root'
})
export class ReportDatabaseService {

    constructor(
        private http: HttpClient,
        private logger: NGXLogger
    ) { }

    send(report: Report): Promise<number> {
        return this.http.post<SendResponse>(sendReportUrl, JSON.stringify(report), httpOptions)
            .pipe(
                retry(3),
                // to map error message to an actual error
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(val => val.report_id)
            ).toPromise();
    }

    fetch(location: string, date: string): Promise<Report> {
        return this.http.post<FetchResponse>(fetchReportUrl, JSON.stringify({ location, date }), httpOptions)
            .pipe(
                retry(3),
                // to map error message to an actual error
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(val => val.report)
            ).toPromise();
    }

    fetchById(id: number): Promise<Report> {
        return this.http.post<FetchResponse>(fetchByIdUrl, JSON.stringify({ id }), httpOptions)
            .pipe(
                retry(3),
                // to map error message to an actual error
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(val => val.report)
            ).toPromise();
    }

    fetchLatest(): Promise<Report> {
        return this.http.get<FetchResponse>(fetchLatestUrl, httpOptions)
            .pipe(
                retry(3),
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(val => val.report)
            ).toPromise();
    }

    getNextN(start: string, location: string, N: number): Promise<ReportSummary[]> {
        return this.http.post<RangeResponse>(getNextNUrl, JSON.stringify({ date: start, location, N }), httpOptions)
            .pipe(
                retry(3),
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(value => value.reports)
            ).toPromise();
    }

    getPrevN(start: string, location: string, N: number): Promise<ReportSummary[]> {
        return this.http.post<RangeResponse>(getPreviousNUrl, JSON.stringify({ date: start, location, N }), httpOptions)
            .pipe(
                retry(3),
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(value => value.reports)
            ).toPromise();
    }

    getUpdates(current: string): Promise<ReportSummary[]> {
        return this.http.post<RangeResponse>(getUpdatesUrl, JSON.stringify({ date: current }), httpOptions)
            .pipe(
                retry(3),
                tap(value => {
                    this.logger.debug(value);
                    if (value.status === 'error') {
                        throw(value.error);
                    }
                }),
                map(value => value.reports)
            ).toPromise();
    }
}
