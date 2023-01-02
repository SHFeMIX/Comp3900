# capstone-project-3900-h16a-cowbee
capstone-project-3900-h16a-cowbee project backend code

## How to config environment
1. Create a vitural environment in your project folder
    1. Open cmd in your project folder
    2. run **'python -m venv venv'** to create a vitural environment
    3. run **'venv\Scripts\activate.bat'** to activate the environment, **'\*\*\deactivate.bat'** to deactivate.
    * Or you can create a new project with <u>venv</u> using <u>pycharm</u>
2. Pull all files in 'backend' to your local project folder. See the **'requirements.txt'** in the project folder, it records all required packages for the project.
3. In your venv, run command **'pip install -r requirements.txt'** in the terminal, then all required packages will be installed.
4. Add one line **'from werkzeug.utils import cached_property'** to file **'venv\Lib\site-packages\werkzeug\__init__.py'**
5. Run **'python -m pip install markupsafe==2.0.1'**
* If you install some new packages, install package **'pipreqs'** and run **'pipreqs ./ --encoding=utf8 --force
'** to update the **requirement.txt** file for other team members to use.
  
## How to run and test
