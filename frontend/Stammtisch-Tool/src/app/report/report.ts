export const unsubmittedId = -1;

export interface Report {
    id: number;
    meeting_date: string;
    start_time: string;
    end_time: string;
    location: string;
    male_organisers: number;
    female_organisers: number;
    diverse_organisers: number;
    male_regular_attendees: number;
    female_regular_attendees: number;
    diverse_regular_attendees: number;
    male_new_attendees: number;
    female_new_attendees: number;
    diverse_new_attendees: number;
    topics: string;
    notes: string;
    report_created_date: string;
    report_send_date: string;
}

export const loadingReport: Report = {
    meeting_date: 'loading...',
    start_time: '',
    end_time: '',
    location: '',
    male_organisers: 0,
    female_organisers: 0,
    diverse_organisers: 0,
    male_regular_attendees: 0,
    female_regular_attendees: 0,
    diverse_regular_attendees: 0,
    male_new_attendees: 0,
    female_new_attendees: 0,
    diverse_new_attendees: 0,
    topics: '',
    notes: '',
    report_created_date: '',
    report_send_date: '',
    id: unsubmittedId
};



export interface ReportSummary {
    id: number;
    location: string;
    meeting_date: string;
    created_date: string;
    saved_date: string;
}

