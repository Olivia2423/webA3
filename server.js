
/********************************************************************************
* BTI325 – Assignment 03
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Olivia Christy Kuitchoua Kewang Student ID: 167357219 Date: 10/15/2023
*
* Published URL: https://github.com/Olivia2423/Assignment-3
*
********************************************************************************/

const express = require("express");
const legoData = require("./modules/legoSets");
const path = require("path");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static("public"));

legoData.initialize()
  .then(() => {
    console.log("Lego data initialized successfully.");

    // Define routes

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/home.html"));
    });

    // Route for "/about"
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/about.html"));
    });

    // Route for "/lego/sets"
    app.get("/lego/sets", (req, res) => {
      const theme = req.query.theme; // Check if the "theme" query parameter is present
      if (theme) {
        legoData.getSetsByTheme(theme)
          .then((sets) => {
            res.json(sets);
          })
          .catch((error) => {
            res.status(404).json({ error: "No matching sets found for the specified theme." });
          });
      } else {
        legoData.getAllSets()
          .then((sets) => {
            res.json(sets);
          })
          .catch((error) => {
            res.status(500).json({ error: "An error occurred while fetching Lego sets." });
          });
      }
    });

    // Route for "/lego/sets/:id-demo"
    app.get("/lego/sets/:set_num", (req, res) => {
      const setNum = req.params.set_num;

      legoData.getSetByNum(setNum)
        .then((set) => {
          if (set) {
            res.json(set);
          } else {
            res.status(404).json({ error: "Set not found." });
          }
        })
        .catch((error) => {
          res.status(404).json({ error: "Set not found." });
        });
    });

    // Route for handling custom 404 errors
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error in initialize:', error);
  });
