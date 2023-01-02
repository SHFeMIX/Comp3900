from flask_restx import Namespace, Resource, reqparse
from main.model.ORM import *

upload_ns = Namespace('uploading', description='upload recipes or ingredients')

recipe_rep = reqparse.RequestParser()
recipe_rep.add_argument('name', type=str)  # , location='args')
recipe_rep.add_argument('ingredients_list', type=str)  # , location='args')
recipe_rep.add_argument('contributor_email', type=str)  # , location='args')
recipe_rep.add_argument('link', type=str)
recipe_rep.add_argument('category', type=str)

recipe_delete_rep = reqparse.RequestParser()
recipe_delete_rep.add_argument('name', type=str)


@upload_ns.route('/recipe')
class Upload_recipe(Resource):

    def get(self):
        return [
            {'ingredients_set': [IngredientDB.query.filter_by(id=id).first().name for id in
                                 i.ingredients_list.split(',')],
             'searched_times': i.times} for i in
            IngredientSearchDB.query.order_by(IngredientSearchDB.times.desc()).limit(3).all()
        ]

    @upload_ns.expect(recipe_rep)
    def post(self):
        args = recipe_rep.parse_args()
        # name不可以重复
        if RecipeDB.query.filter_by(name=args['name']).first():
            return {'error': 'recipe name already existed'}

        # invalid_name = []
        # valid_name_id = []
        # for name in args['ingredients_list'].split(','):
        #     data = IngredientDB.query.filter_by(name=name).first()
        #     if data:
        #         valid_name_id.append(data.id)
        #     else:
        #         invalid_name.append(name)
        #
        # if invalid_name:
        #     return {'error': {'ingredients dosen\'t existed': invalid_name}}
        #
        # new_recipe = RecipeDB(
        #     name=args['name'],
        #     ingredients_list=','.join('%s' % n for n in sorted(valid_name_id)),
        #     external_link=args['link'],
        #     contributed_by=UserDB.query.filter_by(email=args["contributor_email"]).first().id
        # )

        new_recipe = RecipeDB(
            name=args['name'],
            ingredients_list=','.join('%s' % n for n in [IngredientDB.query.filter_by(name=name).first().id
                                                         for name in args['ingredients_list'].split(',')
                                                         ]
                                      ),
            external_link=args['link'],
            contributed_by=UserDB.query.filter_by(email=args["contributor_email"]).first().id,
            category=args['category']
        )

        db.session.add(new_recipe)
        db.session.commit()

        return 200

    @upload_ns.expect(recipe_delete_rep)
    def delete(self):
        args = recipe_delete_rep.parse_args()
        recipe = RecipeDB.query.filter_by(name=args['name']).first()
        if not recipe:
            return {'error': 'recipe not existed'}, 404

        db.session.delete(recipe)
        db.session.commit()

        return 200


ingredient_rep = reqparse.RequestParser()
ingredient_rep.add_argument('name', type=str)
ingredient_rep.add_argument('category', type=str)


@upload_ns.route('/ingredient')
class Upload_ingredient(Resource):

    @upload_ns.expect(ingredient_rep)
    def post(self):
        args = ingredient_rep.parse_args()

        exist = IngredientDB.query.filter_by(name=args['name']).first()
        if exist:
            return {'error': 'ingredient already existed'}

        new_ingredient = IngredientDB(
            name=args['name'],
            category=args['category']
        )
        db.session.add(new_ingredient)
        db.session.commit()

        return 200
