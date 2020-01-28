# Stammtisch-tool quick start

1. Clone repo: `git clone https://gitlab.cs.uni-saarland.de/se/courses/se19/project22.git`
2. Create a virtual environment, e.g. [conda](https://docs.conda.io/en/latest/): `conda create -n p22 python=3`
This step is not mandatory, but it is safer to use a virtual environment, so that we can keep under control all the dependencies, so that no other software which uses other packages/versions will not interfere with our web-site and won't break it. `p22` stands for **project 22** but it can be any other name as well. 
3. Activate the virtual environment: `conda activate p22` 
4. Install the requirements: `pip install -r requirements.txt`
5. Setup a database, and make sure that the following parameters in the `main.py` are replaced with the correct values:

```
aapp.config['MYSQL_HOST'] = '...'
app.config['MYSQL_USER'] = '...'
app.config['MYSQL_PASSWORD'] = '...'
app.config['MYSQL_DB'] = 't1CY93V7rX'
app.config['SQLALCHEMY_DATABASE_URI'] = '...'

```

6. Set environmental variables: `export FLASK_APP=main.py` and **for the deveopers ONLY (not in the production version)** `export FLASK_ENV=development`
7. Run flask: `flask run --host 0.0.0.0`.
Then the web-app will be accessible via http. option `--host 0.0.0.0` means that it will be accessible to other IPs, not only to localhostNow the web-app can be accessed as `http://localhost:5000/login` from the local computer, or by IP address for all the others (or by URL).

## HTTPS

To enable https, need to general SSL certificate
1. `openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365`
2. run Flask wit the following option: `flask run --host 0.0.0.0 --cert=cert.pem --key=key.pem`

## Accessing the web-site

The app can be accessed via browser under a url: `https://localhost:5000/login`

As the LDAP connection was not required to setup, currently any of the following logins can be used to access a web-site:

1. login: `1`, password: `1`. Will display a list of 6 different locations
2. login: `2`, password: `2`. Will display a list of 2 locations
3. login: `3`, password: `3`. Will display a list of 1 location
4. login: `4`, password: `4`. Will display an empty list of locations 





## Troubleshooting

### python-ldap (Ubuntu)
When installing `python-ldap` on Ubuntu there might occur the following error: 

```
Modules/constants.h:7:18: fatal error: lber.h: No such file or directory
compilation terminated.
error: command 'gcc' failed with exit status 1
```

To fix it, install the following packages: 

```
sudo apt-get install libsasl2-dev python-dev libldap2-dev libssl-dev
``` 

### python-ldap (Windows)
When installing 'python-ldap' on Windows there might occur following error:
'''
modules\errors.h(8): fatal error C1083: Cannot open include file: 'lber.h': No such file or directory
error: command 'C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\cl.exe' failed with exit status 2
'''
which is because many Python modules have trouble installing on Windows.
To fix this, one can install pre-built wheel by following the given steps: 

1. Ensure you have pip 19.2+ installed. :
    $ pip --version
2. Check your Python version and architecture (32/64 bit): 
    $ python -c 'import sys; print(sys.version)'
3. Download the matching pre-built *.whl from " https://www.lfd.uci.edu/~gohlke/pythonlibs/#python-ldap "
4. Install it with: 
    $ pip install path\to\your.whl


### ModuleNotFoundError 

When running unittests an error `ModuleNotFoundError: No module named 'db_models'` might occur.
This has been fixed by adding a `setup.py` files and `__init__.py` in each directory. 
If this error occurs, just run `python setup.py install`

###  LINUX : Could not find module "@angular-devkit/build-angular"

can be fixed by running
```
npm install --save-dev @angular-devkit/build-angular
```



### Migrations 

When running our wonderful migrations, in particular the command `flask db upgrade` it will most likely fail with the following error:

```
  File "/home/kate/miniconda3/envs/p22/lib/python3.8/site-packages/sqlalchemy/dialects/mysql/base.py", line 2018, in visit_VARCHAR
    raise exc.CompileError(
sqlalchemy.exc.CompileError: (in table 'reports', column 'id'): VARCHAR requires a length on dialect mysql
``` 

This is caused by `python-mysql` package, which does not fully support python3, but we are forced to use it because there are no other alternatives. This is great, and we have to deal with it as following:

1. go to `project22/migrations/versions/<version_to_edit>.py`
2. find `upgrade` method.
3. manually replace all occurences of `sa.String()` with `sa.String(255)`
 

## Mysql db

Use the following command to connect to mysql db

```
mysql --host=... --user=... -p ...
```
Then you will be prompted for password, enter this password.
```
...
```
name of the database for now is sql7315108, create tables has to be done in this. for now just ramdomly testing. will update soon.

## Migrations

MySQL database is a great source of unnecessary problems. To prevent the app from crashing every time when something in the DB has changed, we have to use migrations.

For the first time when flask is running, use the following commands:

```
flask db init
flask db migrate
flask db upgrade
``` 

This is supposed to create a database will all necessary tables. But. See section [Troubleshooting](###Migrations) 
