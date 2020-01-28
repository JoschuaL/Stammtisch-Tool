from flask import Blueprint, render_template, request, jsonify
from flask_login import login_user, logout_user, current_user
login_page = Blueprint('login_page', __name__, template_folder="../static")


@login_page.route('/login', methods=['GET', 'POST'])
@login_page.route('/', methods=['GET'])
def login():
    """
    Dummy implementation.
    The real login is to be implemented by Ben & co :)
    """
    from main import app
    from main import User

    if request.method == "POST":
        # get parameters
        data = request.get_json(force=True)
        username = data.get('username')
        password = data.get('password')

        user = User.check_password(username, password)
        if user is not None:
            # remember=True means that the session will remember a user.
            # If not set, the user will be deleted from the session once the browser tab is closed
            login_user(user, remember=True)
            return jsonify({'status': 'success', 'user_data': user.to_json()})
        else:
            # what if connection to LDAP failed?
            return jsonify({
                'status': 'error',
                'error': 'Incorrect username or password'
            })

    # if GET, return index.html
    return app.send_static_file('index.html')

@login_page.route('/logout', methods=['GET', 'POST'])
def logout():
    try:
        logout_user()
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})


@login_page.route('/check_user', methods=['GET'])
def check_user():
    try:
        if current_user and current_user.is_authenticated:
            return jsonify({'status': 'success'})
        else:
            return jsonify({'status': 'unauthenticated'})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)})
