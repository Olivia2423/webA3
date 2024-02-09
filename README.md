**OBJECTIVE:**

The objective of the provided code is to develop a web application that serves LEGO set data through various routes while incorporating user authentication and session management functionalities. The application involves setting up directories and files, including a "data" folder for storing theme data and a "modules" folder for defining LEGO set-related functions. The "legoSets.js" module facilitates accessing LEGO set data, with functions to initialize the data, retrieve all sets, retrieve sets by set number, and retrieve sets by theme. The "server.js" file configures routes for serving static content, demonstrating LEGO set functionalities, and implementing dynamic routes, status codes, and custom error handling. Additionally, the application incorporates user account registration, login, logout, and session management functionalities using MongoDB Atlas for database storage, bcryptjs for password hashing, and client-sessions for managing user sessions. Views such as login, registration, user history, and error pages are provided to enhance user interaction. Finally, the application can be deployed online using Cyclic for public access.

**Part 1**:

Setting Up Directories and Files
Files and Directories:
Folders to Create:

Create a new folder for the assignment.
Inside the folder, create "data" and "modules" folders.
Data Files:

Place "themeData.json" in the "data" folder.
Download the LEGO sets dataset in CSV format and convert it to JSON.
JavaScript Module:

Place the "themeData.json" file in the "data" folder.
 You can find the specific "sets.csv" file (available within a .zip file)

 [sets (1).zip](https://github.com/Olivia2423/webA3/files/14217914/sets.1.zip)



**Part 2:**

Create a new file called "legoSets.js" in the "modules" folder.
Download the "sets" dataset in a .csv format from Rebrickable.com and convert it to JSON format.
Writing legoSets.js
Functions:
Initialize()
getAllSets()
getSetByNum(setNum)
getSetsByTheme(theme)
Refactor functions to use Promises.
Export the functions as a module.

**Part 3:**

Creating the Web Server
Create a new file called "server.js" in the root of your assignment folder.
Run "npm init" and "npm install express" to set up the project dependencies.
Configure routes in "server.js":
GET "/" - Return text: "Assignment 2: Student Name - Student Id"
GET "/lego/sets" - Respond with all Lego sets.
GET "/lego/sets/num-demo" - Demonstrate getSetByNum functionality.
GET "/lego/sets/theme-demo" - Demonstrate getSetsByTheme functionality.
Ensure the "sets" array is built before starting the server.

**Part 4:**

Adding Tailwind CSS and HTML Files
Files:
HTML Files:
views/home.html
views/about.html
views/404.html


**Part 5:**

Updating server.js for Dynamic Routes and Status Codes
Functions:
Custom error handling and status code setup in server.js.


**Part 6:**

Deploying the Site
Platform:
Use Cyclic to publish the site online.
User Accounts and Sessions

**Step 1:**
Setting Up MongoDB Atlas
Links:
MongoDB Atlas

**Step 2:**
Adding "auth-service" Module
Modules:
Module File: "auth-service.js"
Dependencies:
Install mongoose using npm.

**Step 3:**
Adding authData.initialize to Startup Procedure
Incorporate authData.initialize into the promise chain in server.js.

**Step 4:**
Configuring Client Session Middleware
Dependencies:
Install client-sessions using npm.

**Step 5:**
Adding New Routes
Routes:
GET /login
GET /register
POST /register
POST /login
GET /logout
GET /userHistory

**Step 6:**
Updating/Add New Views
Views:
navbar.ejs
login.ejs
register.ejs
userHistory.ejs
set.ejs


**Part B - Hashing Passwords**

Dependencies:
Install bcryptjs using npm.


