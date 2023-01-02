from flask_restx import Namespace, Resource, reqparse
from main.model.ORM import *

user_ns = Namespace('user operating', description='acting provided for users')

user_recipe_rep = reqparse.RequestParser()
user_recipe_rep.add_argument('email', type=str)

user_edit_rep = reqparse.RequestParser()
user_edit_rep.add_argument('name', type=str)
user_edit_rep.add_argument('link', type=str)
user_edit_rep.add_argument('ingredients', type=str)


@user_ns.route('/recipes')
class User_operations(Resource):
    @user_ns.expect(user_recipe_rep)
    def post(self):
        return {'recipeNames': [i.name for i in
                                UserDB.query.filter_by(email=user_recipe_rep.parse_args()['email']).first().recipes_id]}

    @user_ns.expect(user_edit_rep)
    def patch(self):
        args = user_edit_rep.parse_args()
        recipe = RecipeDB.query.filter_by(name=args['name']).first()

        if args['link']:
            recipe.external_link = args['link']

        if args['ingredients']:
            recipe.ingredients_list = ','.join('%s' % n for n in [IngredientDB.query.filter_by(name=name).first().id
                                                                  for name in args['ingredients'].split(',')
                                                                  ])
        db.session.commit()

        return 200


user_personal_get_rep = reqparse.RequestParser()
user_personal_get_rep.add_argument('email', type=str)
user_personal_get_rep.add_argument('action', type=str)  # explore, follow, favourite

user_personal_action_rep = user_personal_get_rep.copy()
user_personal_action_rep.add_argument('item')


@user_ns.route('/personal')
class User_actions(Resource):

    @user_ns.expect(user_personal_get_rep)
    def get(self):
        return self._edit(user_personal_action_rep.parse_args(), 'get')

    @user_ns.expect(user_personal_action_rep)
    def post(self):
        return self._edit(user_personal_action_rep.parse_args(), 'append')

    @user_ns.expect(user_personal_action_rep)
    def delete(self):
        return self._edit(user_personal_action_rep.parse_args(), 'remove')

    def _edit(self, args, how):
        user = UserDB.query.filter_by(email=args['email']).first()
        list_name = args['action'] + '_list'
        id_list = eval(getattr(user, list_name))

        query_db, query_attr = ('UserDB', 'email') if args['action'] == 'follow' else ('RecipeDB', 'name')

        if how == 'get':
            return [getattr(eval(query_db).query.filter_by(id=i).first(), query_attr) for i in id_list][-1::-1]

        query_string = f"{query_db}.query.filter_by({query_attr}='{args['item']}').first().id"
        # print(query_string)
        item_id = eval(query_string)

        if (item_id in id_list) and (how == 'append'):
            return {'error': 'repeated operation'}

        getattr(id_list, how)(item_id)
        setattr(user, list_name, str(id_list))
        db.session.commit()

        return 200
