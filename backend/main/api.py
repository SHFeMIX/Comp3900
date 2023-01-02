from flask import Blueprint
from flask_restx import Api
from main.controller.auth import auth_ns
from main.controller.search import search_ns
from main.controller.upload import upload_ns
from main.controller.mark import mark_ns
from main.controller.user import user_ns

bp = Blueprint('api', __name__)

api = Api(
    bp,
    title='Recipe Recommendation System',
    description='COMP3900 Project'
)

api.add_namespace(auth_ns, "/auth")
api.add_namespace(search_ns, "/search")
api.add_namespace(upload_ns, "/upload")
api.add_namespace(mark_ns, "/mark")
api.add_namespace(user_ns, "/user")