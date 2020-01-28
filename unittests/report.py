import unittest
from db_models.report import Report
from datetime import date
from dateutil.parser import parse

from main import app


class TestReport(unittest.TestCase):
    def setUp(self):
        with app.app_context():
            from main import get_db
            self.db = get_db()
            self.object_to_remove = []

    # def tearDown(self):
    #     # delete objects which have been created by the test
    #     for obj in self.object_to_remove:
    #         self.db.session.delete(obj)
    #     self.db.session.commit()

    def test_create_report(self):
        report = Report()
        report.location = "Heidelberg"
        self.assertEqual(report.location, "Heidelberg")
        self.assertNotEqual(report.location, "")

    def test_save_object(self):
        report = Report()
        report.location = 'Heidelberg'
        report.date = date.today()
        report.start_time = parse("14:30").time()
        report.end_time = parse("16:30").time()
        self.object_to_remove.append(report)
        report.report_saved = date.today()
        self.db.session.add(report)
        self.db.session.commit()

        report2 = Report.get_by_date_and_location(date.today(), "Heidelberg")

        self.assertIsNotNone(report2)
        # self.assertEquals(report.id, report2.id)


if __name__ == '__main__':
    unittest.main()
