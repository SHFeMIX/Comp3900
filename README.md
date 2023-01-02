# capstone-project-3900-h16a-cowbee
capstone-project-3900-h16a-cowbee created by GitHub Classroom     

ps: 本人只负责后端，前端所有js都写一个文件里将近两千行跟我没有任何关系


## Backend:
## How to config backend environment on Vlab (Linux)  
1. After extracting the zip file, open your terminal, go into the folder of capstone-project-3900-h16a-cowbee-main, then go into the folder of backend, run the command python3 -m venv venv to create a virtual environment. 

2. Then still in the folder of backend, run the command source venv/bin/activate to to activate the virtual environment. 

3. Then still work in the folder of backend, run the command pip install -r requirements.txt

4. Now you are in the folder of backend, type the command cd venv/lib/python3.9/site-packages/werkzeug/ , then you are under the folder of werkzeug , open the __init__.py file, add a line  ‘from werkzeug.utils import cached_property’ after the existed line ‘from .wrappers import Response’, then save and close the file. 

5. Then go back to the folder of backend, run the command python3 -m pip install markupsafe==2.0.1


## How to run backend on Vlab (Linux)
Every time you want to run the backend of our application, you need to go into the folder of capstone-project-3900-h16a-cowbee-main, then go into the folder of backend, if you have not activated the virtual environment, make sure you run the command source venv/bin/activate firstly, if you have already activated the virtual environment, then you just need to run the command python3 app.py insert_and_run 5000 real 30 then you can start the backend of our application. 



## Frontend:
## How to config frontend environment and run frontend on Vlab (Linux) 
To do this, open a new terminal, go into the folder of capstone-project-3900-h16a-cowbee-main (don’t go into the frontend folder, just work under the folder of capstone-project-3900-h16a-cowbee-main), run the command npm install http-server  

Then whenever you want to start the frontend server, just still work under the folder of capstone-project-3900-h16a-cowbee-main, run the command npx http-server frontend -c 1 -p 8080 , this will start a HTTP server on http://127.0.0.1:8080 which will run our frontend code, you just need to copy this URL to google chrome browser and press enter, then you can start to use our application.

