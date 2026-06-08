"""
Register PyMySQL as the `MySQLdb` driver Django expects.

We use the pure-Python PyMySQL driver (no system libraries to build). Django's
MySQL backend imports `MySQLdb`, so PyMySQL installs itself under that name.
"""
import pymysql

pymysql.install_as_MySQLdb()
