# RESTful API with PostgreSQL
## Prerequisites 
* Install PostgreSQL : `brew install postgresql`
* Start PostgreSQL Server: `pg_ctl -D /usr/local/var/postgres start`
* Create database using postgres: `psql postgres`
* Update connection info in [dbHelper.js](https://github.com/Beadsley/presidents/blob/master/psql/dbHelper.js), info can be found in postgres with the following command `\conninfo`
* Run application with node app.js
* Remember correct request headers
