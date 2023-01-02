from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS

#
# def after_request(response):
#     response.headers['Access-Control-Allow-Origin'] = '*'
#     response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE,OPTIONS'
#     response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
#     return response


app = Flask(__name__)
CORS(app)
# app.after_request(after_request)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

