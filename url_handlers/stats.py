from flask import Blueprint, render_template, request
stats_page = Blueprint('stats_page', __name__, template_folder="../static")


@stats_page.route('/stats', methods=['GET', 'POST'])
def get_stats():
    if request.method == "GET":
        from main import app
        return app.send_static_file('index.html')
    else:
        return ""


