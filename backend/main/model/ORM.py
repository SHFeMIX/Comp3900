from main import db


class UserDB(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=False, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    pass_hashcode = db.Column(db.String, unique=False, nullable=False)

    explore_list = db.Column(db.String, unique=False, nullable=True, default=str([]))
    follow_list = db.Column(db.String, unique=False, nullable=True,default=str([]))
    favourite_list = db.Column(db.String, unique=False, nullable=True, default=str([]))

    recipes_id = db.relationship('RecipeDB', backref='user')


class RecipeDB(db.Model):
    __tablename__ = 'recipe'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    external_link = db.Column(db.String, unique=False, nullable=True)
    picture = db.Column(db.String, unique=False, nullable=True)
    average_rate = db.Column(db.Float, default=0, nullable=True)
    rate_count = db.Column(db.Integer, default=0, nullable=False)
    category = db.Column(db.Enum('breakfast', 'lunch', 'dinner'), nullable=False)

    ingredients_list = db.Column(db.String, unique=False, nullable=False)

    contributed_by = db.Column(db.Integer, db.ForeignKey('user.id'))

    comments_id = db.relationship('CommentDB', backref='recipe')


class CommentDB(db.Model):
    __tablename__ = 'comment'

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'))
    text = db.Column(db.TEXT)


class IngredientDB(db.Model):
    __tablename__ = 'ingredient'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    category = db.Column(db.String, unique=False, nullable=False)


class IngredientSearchDB(db.Model):
    __tablename__ = 'ingredients_search'

    id = db.Column(db.Integer, primary_key=True)
    ingredients_list = db.Column(db.String, unique=True, nullable=False)
    times = db.Column(db.Integer, unique=False, nullable=True, default=1)
