# IS421
IS421 


# Pre Installation
You will need:
- npm
- bower
- mysql database

# Installation

After you have cloned the repo to your local directory

Run the following commands on terminal

<code>npm install</code> and <code>bower install</code>

- Use the <b>create_database.sql</b> script to create the database

Create the following user account for the database to use:<br>
- username: user1 <br>
- password: password

# Post Installation

After everything is set up, you should be able to run <code>node app.js</code>

Sample login account:
- username: urvesh <br>
- password: 123123

#Local DB Configurations

After pulling the repo, and updating your pool.js file if needed to your own login user/password

Run the following command so it does not push or pull this file in the future.

<code>git update-index --assume-unchanged -- config/pool.js</code>


Undo command 
<code>git update-index --no-assume-unchanged -- config/pool.js</code>




