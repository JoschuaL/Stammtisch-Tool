from flask import Blueprint, render_template, request, jsonify
from db_models.report import Report
import datetime
from dateutil.parser import parse as dt_parse
from flask_login import login_required, current_user, logout_user

home_page = Blueprint('home_page', __name__)


@home_page.route('/home', methods=['GET'])
@home_page.route('/status/global', methods=['GET'])
@home_page.route('/status/own', methods=['GET'])
@home_page.route('/stats', methods=['GET'])
@home_page.route('/edit', methods=['GET'])
@login_required
def reports():
    from main import app
    return app.send_static_file('index.html')


@home_page.route('/save_report', methods=['POST'])
@login_required
def save_report():
    if 'json' not in request.content_type:
        return jsonify({'status': 'error', 'error': 'content type should be json. Got instead: {}'.format(request.content_type)})
    data = request.get_json(force=True)
    if data is None:
        return jsonify({'status': 'error', 'error': 'No report received or data is not a valid json'})
    report = Report()
    report.date = data.get('meeting_date')
    report.start_time = data.get('start_time')
    report.end_time = data.get('end_time')
    report.location = data.get('location')
    report.female_organizers = data.get('female_organisers')
    report.male_organizers = data.get('male_organisers')
    report.other_organizers = data.get('diverse_organisers')

    report.male_attendees = data.get('male_regular_attendees')
    report.female_attendees = data.get('female_regular_attendees')
    report.other_attendees = data.get('diverse_regular_attendees')

    report.female_new_attendees = data.get('female_new_attendees')
    report.male_new_attendees = data.get('male_new_attendees')
    report.other_new_attendees = data.get('diverse_new_attendees')
    report.report_saved = datetime.date.today().isoformat()
    report.report_created = data.get('report_created_date', datetime.date.today().isoformat())
    report.report_created = dt_parse(report.report_created).date().isoformat()
    report.topics = data.get('topics')
    report.important_notes = data.get('notes')
    report_id = data.get('id')
    try:
        if report_id != -1:
            existing_report = Report.get_by_id(report_id)
            if existing_report is not None:
                existing_report.update(report)
            else:
                report.save()
        else:
            report.save()
        error = None
        status = 'success'
    except Exception as e:
        status = 'error'
        error = str(e)
    return jsonify({'status': status, 'error': error, 'report_id': report.id})


@home_page.route('/report_exists', methods=['POST'])
@login_required
def report_exists():
    if 'json' not in request.content_type:
        return jsonify({'status': 'error', 'error': 'content type should be json. Got instead: {}'.format(request.content_type)})
    data = request.get_json(force=True)
    if data is None:
        return jsonify({'status': 'error', 'error': 'No data received or is not a valid json'})
    date = data.get('date')
    location = data.get('location')
    try:
        report = Report.get_by_date_and_location(date, location)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})
    response = {'status': 'success', 'report_exists': False}
    if report is not None:
        response['report_exists'] = True
        response['report_id'] = report.id
    return jsonify(response)


@home_page.route('/get_last_report', methods=['POST', 'GET'])
@login_required
def get_last_report():
    try:
        report = Report.get_last_report()
        return jsonify({'status': 'success', 'report': report.to_json()})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})


@home_page.route('/get_by_location_and_date', methods=['POST'])
@login_required
def get_by_location_and_date():
    if 'json' not in request.content_type:
        return jsonify({'status': 'error', 'error': 'content type should be json. Got instead: {}'.format(request.content_type)})
    data = request.get_json(force=True)
    if data is None:
        return jsonify({'status': 'error', 'error': 'No data received or is not a valid json'})
    date = data.get('date')
    location = data.get('location')
    # if no report in the database, empty dict will be returned
    response = {'status': 'success', 'report': {}}
    try:
        report = Report.get_by_date_and_location(date, location)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})
    if report:
        response['report'] = report.to_json()
    return jsonify(response)


@home_page.route('/get_by_id', methods=['POST'])
@login_required
def get_by_id():
    data = request.get_json(force=True)
    report_id = data.get('id')
    response = {'status': 'success', 'report': {}}
    try:
        report = Report.get_by_id(report_id)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})
    if report:
        response['report'] = report.to_json()
    return jsonify(response)


@home_page.route('/get_next_N_reports', methods=['POST'])
@login_required
def get_next_N_reports():
    if 'json' not in request.content_type:
        return jsonify({'status': 'error', 'error': 'content type should be json. Got instead: {}'.format(request.content_type)})
    data = request.get_json(force=True)
    if data is None:
        return jsonify({'status': 'error', 'error': 'No data received or is not a valid json'})
    N = data.get('N')
    location = data.get('location')
    date = data.get('date')
    try:
        reports = Report.get_next_N_reports(location, date, N)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})
    return jsonify({'status': 'success', 'reports': [rep.to_summary() for rep in reports]})


@home_page.route('/get_prev_N_reports', methods=['POST'])
@login_required
def get_prev_N_reports():
    if 'json' not in request.content_type:
        return jsonify({'status': 'error', 'error': 'content type should be json. Got instead: {}'.format(request.content_type)})
    data = request.get_json(force=True)
    if data is None:
        return jsonify({'status': 'error', 'error': 'No data received or is not a valid json'})
    N = data.get('N')
    location = data.get('location')
    date = data.get('date')
    try:
        reports = Report.get_prev_N_reports(location, date, N)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})
    return jsonify({
        'status': 'success',
        'reports': [rep.to_summary() for rep in reports]
    })


@home_page.route('/get_updates', methods=['POST'])
@login_required
def get_updates():
    data = request.get_json(force=True)
    date = data.get('date')
    if date is None:
        return jsonify({'status': 'error', 'error': 'No date received'})
    try:
        reports = Report.get_updates(date)
        return jsonify({
            'status': 'success',
            'reports': [rep.to_summary() for rep in reports]
        })
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})
