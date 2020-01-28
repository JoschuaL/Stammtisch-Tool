import unittest
from db_models.report import Report
from datetime import date
from dateutil.parser import parse

from main import get_db

db = get_db()

# import mysql
# import pymysql
# pymysql.install_as_MySQLdb()
# import MySQLdb
# mysql://sql7315108:YamlbBAIHx@sql7.freemysqlhosting.net
# db = MySQLdb.connect(host="sql7.freemysqlhosting.net",    # your host, usually localhost
#                      user="sql7315108",         # your username
#                      passwd="YamlbBAIHx",  # your password
#                      db="sql7315108")
#
# class TestReport(unittest.TestCase):
#     def setUp(self):
#         # self.db = g.db
#
#         # self.db = mysql.connector.connect(
#         #     host="sql7.freemysqlhosting.net",
#         #     user="sql7315108",
#         #     passwd="YamlbBAIHx"
#         #
#         # )
#         engine = create_engine(
#                 "mysql://sql7315108:YamlbBAIHx@sql7.freemysqlhosting.net/sql7319232.db",
#                 # isolation_level="READ UNCOMMITTED"
#             )
#         self.db = engine.connect()
#         self.object_to_remove = []
#
#     def tearDown(self):
#         for obj in self.object_to_remove:
#             self.db.session.delete(obj)
#         self.db.session.commit()
#
#     def test_create_report(self):
#         report = Report()
#         report.location = "Heidelberg"
#         assert report.location == "Heidelberg"
#         assert report.location != ""
#
#     def test_save_object(self):
#         report = Report()
#         report.location = 'Heidelberg'
#         report.date = date.today()
#         report.start_time = parse("14:30").time()
#         report.end_time = parse("16:30").time()
#         self.object_to_remove.append(report)
#         report.report_saved = date.today()
#         self.db.session.add(report)
#         self.db.session.commit()
#
#         report2 = Report.get_by_date_and_location(date.today(), "Heidelberg")
#         assert report is report2
#
#
# if __name__ == '__main__':
#     unittest.main()
#
#
# class TestReportObject(unittest.TestCase):
#     def test_assign_attributes(self):
#         report = Report()
#
#         report.meetup_location = 'Heidelberg'
#         report.meetup_date = date.today()
#         report.male_organizers = 2
#         report.female_organizers = 0
#         report.other_organizers = 0
#
#         self.assertEqual(report.meetup_location, 'Heidelberg')
#         self.assertNotEqual(report.male_organizers, 20)
#         self.assertEqual(report.meetup_date, date.today())
#         self.assertEqual(report.female_organizers, 0)
#         self.assertNotEqual(report.other_organizers, 4)
#
# if __name__ == '__main__':
#     unittest.main()
