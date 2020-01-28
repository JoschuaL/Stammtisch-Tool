# coding: utf-8
# these lines have to be exactly here, and nowhere else
## fix of mysql imcompatibility with python3 ###
import pymysql
pymysql.install_as_MySQLdb()
## end of fix ###

from flask import Flask, g, request
from url_handlers.login import login_page
from url_handlers.home import home_page
from url_handlers.stats import stats_page
from flask_migrate import Migrate
from db_models.report import db
from flask_login import LoginManager, UserMixin
from datetime import timedelta


# app is the object which will serve all the web-pages
app = Flask(__name__, static_url_path="", static_folder='static')
db.init_app(app)
# each web-page (blueprint) has to be registered in the flask app
app.register_blueprint(login_page)
app.register_blueprint(home_page)
app.register_blueprint(stats_page)

# example of ldap config
app.config['LDAP_URL'] = ''
app.config['LDAP_BASE_DN'] = 'OU=users,dc=example,dc=org'
app.config['LDAP_USERNAME'] = 'CN=user,OU=Users,DC=example,DC=org'
app.config['LDAP_PASSWORD'] = ''

# sqlalchemy config
app.config['MYSQL_HOST'] = ''
app.config['MYSQL_USER'] = ''
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = ''
app.config['SQLALCHEMY_DATABASE_URI'] = ''
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


app.secret_key = ''
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(weeks=26)
app.config['SESSION_FILE_THRESHOLD'] = 1000

# this function implements a connection to a database
def get_db():
    """ connects to a database and returns a database object"""
    if not hasattr(g, 'db'):
        g.db = db
    return g.db


# connection to LDAP server
def get_ldap():
    """connects to ldap and returns ldap connection"""
    # if not hasattr(g, 'ldap'):
    #     g.ldap = ldap.initialize(app.config['LDAP_URL'])
    # return g.ldap
    return None


with app.app_context():
    migrate = Migrate(app, get_db())


# login stuff

# Since we don't have an ldap connection, the user class will be implemented in a dummy way
# it requires the following methods:
# # is_authenticated
# # is_active
# # is_anonymous
# # get_id()
# more info: https://flask-login.readthedocs.io/en/latest/
class User(UserMixin):
    def __init__(self, username=None):
        self.id = None
        self.username = None
        self.locations = []

    def is_authenticated(self):
        if self.get_id(): # means: not None, not "", not False
            return True
        return False

    def is_active(self):
        """
        means if user account was activated or not. Let's assume it's always True
        :return: True
        """
        return True

    def is_anonymous(self):
        """
        Let's say our system does not support anonymous users. So this method will always return False
        :return: False
        """
        return False

    @classmethod
    def check_password(cls, username, password): # cleartext password
        user = User(username)

        # # this how a real login should look like
        # user_dn = 'CN={},{}'.format(self.username, app.config.get('LDAP_BASE_DN'))
        # user_data = get_ldap().bind_s(user_dn, self.password)
        # user.id = user_data.get('id')
        # user.locations = user_data.get('locations', [])

        # # this will be our temporary solution
        locations1 = ['Saarbrücken', 'Köln', 'Frankfurt', 'Berlin', 'Mainz', 'Heidelberg']
        locations2 = ['Saarbrücken', 'Heidelberg']
        locations3 = ['Heidelberg']
        locations4 = []
        if username == '1' and password == '1':
            user.id = '1'
            user.locations = locations1
        elif username == "2" and password == "2":
            user.id = "2"
            user.locations = locations2
        elif username == "3" and password == "3":
            user.id = "3"
            user.locations = locations3
        elif username == "4" and password == "4":
            user.id = "4"
            user.locations = locations4

        if user.get_id():
            return user
        else:
            return None

    def get_id(self):
        if self.id:
            return self.id
        return None

    def to_json(self):
        return {'username': self.username, 'locations': self.locations}

    @classmethod
    def get_by_id(cls, user_id):
        """
        This is also required by a login_manager
        :param user_id:
        :return: user object
        """
        ##  I don't know how to implement it, cause we need a password to get a user data
        ## I guess it's not possible to access ldap without having any kind of password
        ## for the "real" implementation, probably need to store a login/password for ldap connection in the app.config
        return cls.check_password(username=user_id, password=user_id)


login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.get_by_id(user_id)