import requests
import random
import json


class Insertion:
    def __init__(self, port, how, num, host="http://127.0.0.1:"):
        self.how = how
        self.route = host + str(port)
        self.num = num

    def _make_show_request(self, url, method):
        getattr(requests, method)(self.route + url)
        # print(url)

    def _insert_users(self):
        for i in range(1, self.num + 1):
            req = f"/auth/register?password={str(i) * 3}&email=unsw{i}.com&name=user{i}"
            self._make_show_request(req, 'post')

    def _insert_test_ingredients(self):
        for no in range(1, self.num + 1):
            n_cate = random.randint(1, 5)
            req = f"/upload/ingredient?name=ingredient{no}&category=category{n_cate}"
            self._make_show_request(req, 'post')

    def _insert_test_recipes_and_rate(self):
        category = {1: 'breakfast', 2: 'lunch', 3: 'dinner'}
        for no in range(1, self.num + 1):
            # ingredients_list 是随机1-10个1-self.num之间的随机数
            ingredients_list = set([random.randint(1, self.num) for i in range(random.randint(1, 10))])
            ingredients_list = ','.join([f'ingredient{i}' for i in ingredients_list]).replace(' ', '')

            # contributed_by 是1-self.num之间的随机数
            contributed_by = random.randint(1, self.num)

            req = f"/upload/recipe?name=recipe{no}&ingredients_list={ingredients_list}&contributor_email=unsw{contributed_by}.com&category={category[random.randint(1, 3)]}"
            self._make_show_request(req, 'post')
            # rate
            req = f"/mark/rate?name=recipe{no}&mark={random.randint(0, 5)}"
            self._make_show_request(req, 'post')

    def _insert_real_ingredients(self):
        ingredients = json.load(open("数据/食材_2.json", "r"))
        for i in ingredients:
            for j in i['ingredients']:
                req = f"/upload/ingredient?name={j}&category={i['name']}"
                self._make_show_request(req, 'post')

    def _insert_real_recipes_and_rate(self):
        mapping = {"早": 'breakfast', '中': 'lunch', '晚': 'dinner'}
        for c in mapping.keys():
            recipes = json.load(open(f'数据/{c}餐.json', 'r', encoding='UTF-8'))

            for i in recipes:
                i['category'] = mapping[c]
                i['contributor'] = random.randint(1, self.num)
                req = f"/upload/recipe?name={i['name']}&ingredients_list={','.join(i['ingredients'])}&contributor_email=unsw{random.randint(1, self.num)}.com&category={mapping[c]}&link={i['external_link']}"
                self._make_show_request(req, 'post')
                # rate
                req = f"/mark/rate?name={i['name']}&mark={random.randint(0, 5)}"
                self._make_show_request(req, 'post')

    def insert(self):
        self._insert_users()
        exec(f"self._insert_{self.how}_ingredients()")
        exec(f"self._insert_{self.how}_recipes_and_rate()")
