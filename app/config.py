# pylint: disable=missing-module-docstring
# pylint: disable=R0903
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL',
    'postgresql://postgres:yourpassword@pg_container:5432/nannyvent')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
