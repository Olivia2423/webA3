
/********************************************************************************
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*
* Published URL: https://turquoise-dibbler-cap.cyclic.cloud/
*
********************************************************************************/

const express = require("express");
const legoData = require("./modules/legoSets");
const path = require("path");
require('dotenv').config();



const app = express();
const port = 8080;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

app.use(express.json());
app.use(express.static("public"));

legoData.initialize()
  .then(() => {
    console.log("Lego data initialized successfully.");

    // Define routes

    app.get("/", (req, res) => {
      res.render("home");
    });

    // Route for "/about"
    app.get("/about", (req, res) => {
      res.render("about");
    });

    //Route for "/lego/sets"
    app.get("/lego/sets", (req, res) => {
      const theme = req.query.theme; // Check if the "theme" query parameter is present
      if (theme) {
        legoData.getSetsByTheme(theme)
          .then((sets) => {
            if (sets.length === 0) {
              res.status(404).render("404", { message: "Unable to find requested set for the theme" });
            } else {
              res.render("sets", { sets: sets });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: "An error occurred while fetching Lego sets." });
          });
      } else {
        legoData.getAllSets()
          .then((sets) => {
            res.render("sets", { sets: sets });
          })
          .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "An error occurred while fetching Lego sets." });
          });
      }
    });

    //Route for "/lego/sets/:id-demo"
    app.get("/lego/sets/:set_num", (req, res) => {
      const setNum = req.params.set_num;

      legoData.getSetByNum(setNum)
        .then((set) => {
          if (set) {
            res.render("set", { set: set });
          } else {
            res.status(404).render("404", { message: "Unable to find requested set" });
          }
        })
        .catch((error) => {
          res.status(404).json({ error: "Set not found." });
        });
    });
//////////////////////////////////////
    //Routes for "lego/addSet" -GET
    app.get("/lego/addSet", (req, res) => {
      legoData.getAllThemes()
        .then((themeData) => {
          res.render("addSet", { themes: themeData });
        })
        .catch((error) => {
          res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
        });
    });

    //Route for "lego/addSet" -POST
    app.post("/lego/addSet", (req, res) => {
      const setData = req.body;

      legoData.addSet(setData)
        .then(() => {
          res.redirect("/lego/sets");
        })
        .catch((error) => {
          res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
        });
    });

  //////////////////////////////////////////////////
    
     // GET "/lego/editSet/:num"
 app.get("/lego/editSet/:num", (req, res) => {
  const setNum = req.params.num;

  Promise.all([legoData.getSetByNum(setNum), legoData.getAllThemes()])
    .then(([set, themeData]) => {
      if (set && themeData) {
        res.render("editSet", { themes: themeData, set: set });
      } else {
        res.status(404).render("404", { message: "Unable to find requested set or themes" });
      }
    })
    .catch((error) => {
      res.status(404).render("404", { message: error.message });
    });
 });

// POST "/lego/editSet"
 app.post("/lego/editSet", (req, res) => {
  const setNum = req.body.set_num;
  const setData = req.body;

  legoData.editSet(setNum, setData)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((error) => {
      res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
    });
  });

  /////////////////////////////////////////

  // GET "/lego/deleteSet/:num"
 app.get("/lego/deleteSet/:num", (req, res) => {
    const setNum = req.params.num;

    legoData.deleteSet(setNum)
      .then(() => {
        res.redirect("/lego/sets");
      })
      .catch((error) => {
        res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
      });
    });


    // Route for handling custom 404 errors
    app.use((req, res) => {
      res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error in initialize:', error);
  });

  


