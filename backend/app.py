from main import app
from flask_script import Manager
from main.model.ORM import *
from main.api import bp

from insert_data import Insertion
import threading
import time

app.register_blueprint(bp)

manager = Manager(app)


@manager.command
def run(port):
    app.run(port=int(port))


@manager.command
def debug(port):
    app.run(debug=True, port=int(port))


@manager.command
def create_db():
    db.create_all()
    print('db.create_all successfully')


@manager.command
def drop_db():
    db.drop_all()
    print('db.drop_all successfully')


def make_insertion(port, how, num):
    time.sleep(1)
    print('\n')
    print('=================================================================')
    for i in range(6):
        print("\r  start to insert data after %s seconds" % (5 - i), end="")
        time.sleep(1)
    print('\r                                              ')

    Insertion(port, how, int(num)).insert()

    print(f'\n=== Succeeded in inserting {how} data with {num} users ==========================\n')


@manager.command
def insert_and_run(port, how, num):
    drop_db()
    create_db()

    run_app = threading.Thread(target=run, args=[port])
    run_app.setDaemon(True)
    run_app.start()

    make_insertion(port, how, num)

    try:
        while True:
            pass
    except KeyboardInterrupt:
        exit()


if __name__ == '__main__':
    print(db)
    manager.run()
