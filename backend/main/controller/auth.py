from collections import defaultdict

from flask_restx import Namespace, Resource, reqparse
from main.model.ORM import *
from hashlib import md5

auth_ns = Namespace('authentication', description='register, login, logout')

register_rep = reqparse.RequestParser()
register_rep.add_argument('password', type=str)  # , location=['json', 'args'])
register_rep.add_argument('email', type=str)  # , location=['json', 'args'])
register_rep.add_argument('name', type=str)  # , location=['json', 'args'])


def encode(password):
    pass_hash = md5()
    pass_hash.update(password.encode('utf-8'))
    return pass_hash.hexdigest()


@auth_ns.route('/register')
class Register(Resource):
    """
    邮箱不能重复
    """

    @auth_ns.expect(register_rep)
    def post(self):
        args = register_rep.parse_args()

        exist = UserDB.query.filter_by(email=args['email']).first()
        if exist:
            return {'error': 'email address already existed'}

        new_user = UserDB(
            name=args['name'],
            email=args['email'],
            pass_hashcode=encode(args['password']),
            # explore_list='',
            # follow_list='',
            # favourite_list=''
        )
        db.session.add(new_user)
        db.session.commit()

        return 200


login_rep = reqparse.RequestParser()
# 这玩意逻辑是有body就解析body忽略url参数，body是none才会解析url参数
# 有body且缺值会直接报错，没body且url参数缺值会解析成none
# 如果限定了location会怎么样还没试过不知道
login_rep.add_argument('password', type=str)  # , location='args')
login_rep.add_argument('email', type=str)  # , location='args')


@auth_ns.route('/login')
class Login(Resource):
    """
    邮箱是否存在
    密码是否对
    """

    @auth_ns.expect(login_rep)
    def post(self):
        args = register_rep.parse_args()
        account_info = UserDB.query.filter_by(email=args['email']).first()

        if not account_info:
            return {'error': 'email address dose not exist'}

        if account_info.pass_hashcode != encode(args['password']):
            return {'error': 'password incorrect'}

        category_info = defaultdict(list)
        for i in IngredientDB.query.all():
            category_info[i.category].append(i.name)
        return category_info
