
/********************************************************************************
* BTI325 – Assignment 03
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Olivia Christy Kuitchoua Kewang Student ID: 167357219 Date: 11/19/2023
*
* Published URL: https://turquoise-dibbler-cap.cyclic.cloud/
*
********************************************************************************/

const express = require("express");
const legoData = require("./modules/legoSets");
const path = require("path");
const authData = require('./modules/auth-service');
const clientSessions = require('client-sessions');
require('dotenv').config();



const app = express();
const port = 8080;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

app.use(
  clientSessions({
    cookieName: 'session', // this is the object name that will be added to 'req'
    secret: process.env.SESSION_SECRET, // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
 });

 function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.use(express.json());
app.use(express.static("public"));

legoData.initialize()
  .then(authData.initialize)
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

    ////////////////////********************************///////////////////////////
   // Route for "/login"
app.get("/login", (req, res) => {
  // Pass an empty userName or retrieve it from the session if available
  const userName = req.session.user ? req.session.user.userName : "";
  res.render("login", { userName: userName, errorMessage: "" });
});



    // Route for "/register"
app.get("/register", (req, res) => {
  // Pass an initial value for errorMessage and userName
  res.render("register", { successMessage: "", errorMessage: "", userName: "" });
});



   // POST route for "/register"
app.post("/register", (req, res) => {
  const userData = req.body;

  authData.registerUser(userData)
    .then(() => {
      res.render("register", { successMessage: "User created", userName: req.body.userName, errorMessage: "" });
    })
    .catch((err) => {
      res.render("register", { errorMessage: err, successMessage: "", userName: req.body.userName });
    });
});

  

    // POST route for "/login"
// POST route for "/login"
app.post("/login", (req, res) => {
  req.body.userAgent = req.get('User-Agent');

  authData.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      };
      res.redirect('/lego/sets');
    })
    .catch((err) => {
      // Pass errorMessage and userName to the view
      res.render("login", { errorMessage: err.message, userName: req.body.userName });
    });
});

    // Route for "/logout"
    app.get("/logout", (req, res) => {
      req.session.reset();
      res.redirect('/');
    });

    // Route for "/userHistory"
    app.get("/userHistory", ensureLogin, (req, res) => {
      res.render("userHistory");
    });




    ///////////////////******************************/////////////////////////////

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
/********/////////////////////////////////////
    //Routes for "lego/addSet" -GET
    app.get("/lego/addSet", ensureLogin, (req, res) => {
      legoData.getAllThemes()
        .then((themeData) => {
          res.render("addSet", { themes: themeData });
        })
        .catch((error) => {
          res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
        });
    });

    //Route for "lego/addSet" -POST
    app.post("/lego/addSet", ensureLogin, (req, res) => {
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
 app.get("/lego/editSet/:num", ensureLogin, (req, res) => {
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
 app.post("/lego/editSet", ensureLogin, (req, res) => {
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
 app.get("/lego/deleteSet/:num", ensureLogin, (req, res) => {
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

  


