from flask_restx import Namespace, Resource, reqparse
from main.model.ORM import *

search_ns = Namespace('searching', description='search recipes by either recipe\'s name or ingredients list')

search_name_rep = reqparse.RequestParser()
search_name_rep.add_argument('name', type=str)
search_name_rep.add_argument('email', type=str)


@search_ns.route('/by_name')
class Searching_by_Name(Resource):
    @search_ns.expect(search_name_rep)
    def post(self):
        args = search_name_rep.parse_args()
        name = args['name']

        recipe = RecipeDB.query.filter_by(name=name).first()

        if not recipe:
            return {'error': 'recipe does not exist'}
        else:
            # update user explore history
            user = UserDB.query.filter_by(email=args['email']).first()
            explore_list = eval(user.explore_list)

            if recipe.id not in explore_list:
                if len(explore_list) == 10:
                    del explore_list[0]
                explore_list.append(recipe.id)
                user.explore_list = str(explore_list)
                db.session.commit()
            ##

            contributor = UserDB.query.filter_by(id=recipe.contributed_by).first()

            return {
                'recipe_name': recipe.name,
                'rate': recipe.average_rate,
                'external_link': recipe.external_link,
                'contributor': {'email': contributor.email,
                                'name': contributor.name,
                                'is_followed': contributor.id in eval(user.follow_list),
                                },
                'category': recipe.category,
                'ingredients': [IngredientDB.query.filter_by(id=id).first().name for id in
                                recipe.ingredients_list.split(',')],
                'comments': [i.text for i in recipe.comments_id],
                'is_favourite': recipe.id in eval(user.favourite_list)

            }


search_list_rep = reqparse.RequestParser()
search_list_rep.add_argument('ingredients_list', type=str)  # , location='args')


@search_ns.route('/by_list')
# 名字 分数 图片 食材有几种
class Searching_by_list(Resource):

    # 先返回所有匹配上的菜谱的简略信息，用户点开具体某一个之后前端再向后端请求具体信息
    @search_ns.expect(search_list_rep)
    def post(self):
        ingredients_str = search_list_rep.parse_args()['ingredients_list']
        have_id_list = [IngredientDB.query.filter_by(name=name).first().id for name in ingredients_str.split(',')]

        has_fully_covered = 0
        return_format = []
        for i in db.session.query(RecipeDB.name, RecipeDB.ingredients_list, RecipeDB.average_rate,
                                  RecipeDB.category).order_by(
                RecipeDB.average_rate.desc()).all():

            need_id_list = i.ingredients_list.split(',')
            miss_id_list = [int(j) for j in need_id_list if int(j) not in have_id_list]

            # 如果缺少大于1 或者 食谱只需要一个食材还缺少
            if len(miss_id_list) > 1 or (miss_id_list and len(need_id_list) == 1):
                continue

            if not miss_id_list:
                has_fully_covered = 1

            return_format.append({'name': i.name,
                                  'rate': i.average_rate,
                                  'category': i.category,
                                  'n_ingredients': len(need_id_list),
                                  'missing': IngredientDB.query.filter_by(id=miss_id_list[0]).first().name if len(
                                      miss_id_list) else None})

        if not has_fully_covered:
            self._update_SearchDB(have_id_list)

        return return_format

    def _update_SearchDB(self, id_list):
        searched_id_str = ','.join('%s' % n for n in sorted(id_list))
        searched_list = IngredientSearchDB.query.filter_by(ingredients_list=searched_id_str).first()
        if searched_list:
            searched_list.times += 1
        else:
            new_searched_list = IngredientSearchDB(
                ingredients_list=searched_id_str,
            )
            db.session.add(new_searched_list)

        db.session.commit()
        return
