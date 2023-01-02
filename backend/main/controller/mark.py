from flask_restx import Namespace, Resource, reqparse
from main.model.ORM import *

mark_ns = Namespace('marking', description='mark recipes by rating or making comment')

rate_rep = reqparse.RequestParser()
rate_rep.add_argument('name', type=str)
rate_rep.add_argument('mark', type=int)


@mark_ns.route('/rate')
class Register(Resource):

    @mark_ns.expect(rate_rep)
    def post(self):
        args = rate_rep.parse_args()
        recipe = RecipeDB.query.filter_by(name=args['name']).first()

        recipe.average_rate = round((recipe.average_rate * recipe.rate_count + args['mark']) / (recipe.rate_count + 1),
                                    1)
        recipe.rate_count += 1
        db.session.commit()

        return 200


comment_rep = reqparse.RequestParser()
comment_rep.add_argument('recipe_name', type=str)
comment_rep.add_argument('text', type=str)

get_name_rep = reqparse.RequestParser()
get_name_rep.add_argument('email', type=str)


@mark_ns.route('/comment')
class Register(Resource):
    @mark_ns.expect(get_name_rep)
    def get(self):
        email = get_name_rep.parse_args()['email']
        return UserDB.query.filter_by(email=email).first().name

    @mark_ns.expect(comment_rep)
    def post(self):
        args = comment_rep.parse_args()

        recipe = RecipeDB.query.filter_by(name=args['recipe_name']).first()

        new_comment = CommentDB(
            recipe_id=recipe.id,
            text=args['text']
        )
        db.session.add(new_comment)
        db.session.commit()

        return 200
