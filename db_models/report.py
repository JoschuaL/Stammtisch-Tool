from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
db = SQLAlchemy()

import datetime

# class Report:
class Report(db.Model):
    __tablename__ = 'reports'
    # id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id = db.Column(db.Integer, db.Sequence('seq_reg_id', start=1, increment=1), primary_key=True)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(100), nullable=False)

    male_organizers = db.Column(db.Integer, nullable=False) # number of organizers of male gender
    female_organizers = db.Column(db.Integer, nullable=False) # number of organizers of female gender
    other_organizers = db.Column(db.Integer, nullable=False) # number of organizers of other gender

    male_attendees = db.Column(db.Integer, nullable=False)
    female_attendees = db.Column(db.Integer, nullable=False)
    other_attendees = db.Column(db.Integer, nullable=False)

    male_new_attendees = db.Column(db.Integer, nullable=False)
    female_new_attendees = db.Column(db.Integer, nullable=False)
    other_new_attendees = db.Column(db.Integer, nullable=False)

    topics = db.Column(db.String(200), nullable=False)
    important_notes = db.Column(db.String(1000))

    # this is not in the form, but required too
    report_saved = db.Column(db.Date, nullable=False)
    report_created = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return "<Report from {} on {} {}-{}>".format(self.location, self.date, self.start_time,
                                                     self.end_time)

    def is_saved(self):
        # get report by date, time and location. If exists we get an id
        report = self.query.filter_by(date=self.date, location=self.location).first()
        if report is not None:
            return True
        return False

    def save(self):
        if not self.report_saved:
            self.report_saved = datetime.date.today().isoformat()
        # if self.date and self.start_time and self.end_time and self.location and self.male_organizers and self.female_organizers \
        #     and self.other_organizers and self.male_attendees and self.female_attendees and self.other_attendees and \
        #     self.male_new_attendees and self.female_new_attendees and self.other_new_attendees and self.topics and \
        #     self.important_notes and self.report_saved:
        db.session.add(self)
        db.session.commit()
        return None
    
    def update(self, new_report):
        self.date = new_report.date
        self.start_time = new_report.start_time
        self.end_time = new_report.end_time
        self.location = new_report.location
        self.male_organizers = new_report.male_organizers
        self.female_organizers = new_report.female_organizers
        self.other_organizers = new_report.other_organizers
        self.male_attendees = new_report.male_attendees
        self.female_attendees = new_report.female_attendees
        self.other_attendees = new_report.other_attendees
        self.male_new_attendees = new_report.male_attendees
        self.female_new_attendees = new_report.female_new_attendees
        self.other_new_attendees = new_report.other_new_attendees
        self.topics = new_report.topics
        self.important_notes = new_report.important_notes
        self.report_created = new_report.report_created
        self.report_saved = datetime.date.today().isoformat()
        db.session.commit()


    @classmethod
    def get_last_report(cls):
        newest_date = db.session.query(func.max(Report.date))        
        report = db.session.query(Report).filter(Report.date == newest_date).first()
        return report

    @classmethod
    def get_n_reports(cls, n):
        return []

    @classmethod
    def get_by_date_and_location(cls, date, location):
        # assuming that in one location there is no more than one meetup per day
        report = cls.query.filter_by(date=date, location=location).first()
        return report


    def to_json(self):
        return {
            'id': self.id,
            'meeting_date': self.date.strftime("%Y-%m-%d"),
            'start_time': self.start_time.strftime("%H:%M"),
            'end_time': self.end_time.strftime("%H:%M"),
            'location': self.location,
            'female_organisers': self.female_organizers,
            'male_organisers': self.male_organizers,
            'diverse_organisers': self.other_organizers,
            'male_regular_attendees': self.male_attendees,
            'female_regular_attendees': self.female_attendees,
            'diverse_regular_attendees': self.other_attendees,
            'female_new_attendees': self.female_new_attendees,
            'male_new_attendees': self.male_new_attendees,
            'diverse_new_attendees': self.other_new_attendees,
            'report_send_date   ': self.report_saved.isoformat(),
            'report_created_date': self.report_created.isoformat(),
            'topics': self.topics,
            'notes': self.important_notes,
        }

    def to_summary(self):
        return {
            'id': self.id,
            'location': self.location,
            'meeting_date': self.date,
            'created_date': self.report_created.isoformat(),
            'saved_date': self.report_saved.isoformat()
        }

    @classmethod
    def get_next_N_reports(cls, location, date, N):
        if(location is not None and location != ''):
            reports = db.session.query(Report).filter(Report.date>=date,Report.location==location).order_by(Report.date.desc()).limit(N).all()
            return reports
        else:
            reports = db.session.query(Report).filter(Report.date>date).order_by(Report.date.desc()).limit(N).all()
            return reports


    @classmethod
    def get_prev_N_reports(cls, location, date, N):
        if(location is not None and location != ''):
            reports = db.session.query(Report).filter(Report.date<=date,Report.location==location).order_by(Report.date.desc()).limit(N).all()
            return reports
        else:
            reports = db.session.query(Report).filter(Report.date<date).order_by(Report.date.desc()).limit(N).all()
            return reports

    @classmethod
    def get_updates(cls, date):
        updates = db.session.query(Report).filter(Report.report_saved > date).order_by(Report.date.desc()).limit(10000).all()
        return updates

    @classmethod
    def get_by_id(cls, id):
        rep = db.session.query(Report).get(id)
        return rep
