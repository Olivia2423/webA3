Objective:
Create and publish a web app that uses multiple routes which serve static content (text / json) as well as create a "lego service" module for accessing data.

Part 1: Getting Started (Files & Directories)
Create a new folder somewhere on your system to store the assignment.
Within this folder, create a "data" folder and a "modules" folder.
Place the "themeData.json" file in the "data" folder.
 You can find the specific "sets.csv" file (available within a .zip file)
[sets (1).zip](https://github.com/Olivia2423/webA3/files/14217336/sets.1.zip)
Create a new file called "legoSets.js" in the "modules" folder.
Download the "sets" dataset in a .csv format from Rebrickable.com and convert it to JSON format.
Part 2: Writing legoSets.js
Create functions in "legoSets.js" to access Lego data.
Functions include: Initialize(), getAllSets(), getSetByNum(setNum), and getSetsByTheme(theme).
Refactor functions to use Promises.
Export the functions as a module.
Part 3: Creating the Web Server
Create a new file called "server.js" in the root of your assignment folder.
Run "npm init" and "npm install express" to set up the project dependencies.
Configure routes in "server.js":
GET "/" - Return text: "Assignment 2: Student Name - Student Id"
GET "/lego/sets" - Respond with all Lego sets.
GET "/lego/sets/num-demo" - Demonstrate getSetByNum functionality.
GET "/lego/sets/theme-demo" - Demonstrate getSetsByTheme functionality.
Ensure the "sets" array is built before starting the server.

Objective:
Build upon the above instructions by adding a custom landing page with links to various sets, an "about" page, and a custom 404 error page. Additionally, update the server.js file to support more dynamic routes, status codes, and static content (css). Finally, publish the solution using Cyclic.

Part 1: Installing / Configuring Tailwind CSS
Follow the steps identified in Tailwind CSS & daisyUI to set up Tailwind CSS.

Part 2: Adding .html Files
Create the following .html files according to the specifications: views/home.html, views/about.html, views/404.html.

Part 3: Updating server.js
Make the following changes to your server.js code to support dynamic routes, status codes, and custom 404 page.

Part 4: Deploying your Site
Publish your site online using Cyclic.
