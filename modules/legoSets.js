/********************************************************************************
* BTI325 – Assignment 06
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Olivia Christy Kuitchoua Kewang Student ID: 167357219 Date: 12/10/2023

* Published URL: https://turquoise-dibbler-cap.cyclic.cloud/

*
********************************************************************************/



require('dotenv').config();
const Sequelize = require('sequelize');


// set up sequelize to point to our postgres database
let sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  }
});

// Define the Theme model
const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt fields
});

// Define the Set model
const Set = sequelize.define('Set', {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  num_parts: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  theme_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  img_url: {
    type: Sequelize.STRING,
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt fields
});

// Create an association between Set and Theme
Set.belongsTo(Theme, { foreignKey: 'theme_id' });


function initialize() {
    return new Promise((resolve, reject) => {
      sequelize.sync().then(()=>{
        resolve();
      }).catch(err=>{
        reject(err);
      })
    });
  }
  

// Function to get all sets
function getAllSets() {
  return new Promise((resolve,reject) => {
    Set.findAll({include: [Theme]}).then(data=>{
      resolve(data);
    }).catch(err=>{
      reject(err);
    })
  });
}


// Function to get a set by its set number
function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findOne({
      where: { set_num: setNum },
      include: [Theme],
    })
      .then((foundSet) => {
        if (foundSet) {
          resolve(foundSet);
        } else {
          reject("Unable to find requested set");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}


function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    Set.findAll({include: [Theme], where: { 
      '$Theme.name$': {
      [Sequelize.Op.iLike]: `%${theme}%`
      }
     }})
      .then((matchingSets) => {
        if (matchingSets.length === 0) {
          reject("Unable to find requested sets");
        } else {
          resolve(matchingSets);
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error.message);
      });
  });
}

function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll().then(themes => {
      resolve(themes);
    }).catch(err => {
      reject(err);
    });
  });
}

// Function to add a new set
function addSet(setData) {
  return new Promise((resolve, reject) => {
    Set.create(setData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

// Function to edit a set
function editSet(setNum, setData) {
  return new Promise((resolve, reject) => {
    Set.update(setData, { where: { set_num: setNum } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

// Function to delete a set
function deleteSet(setNum) {
  return new Promise((resolve, reject) => {
    Set.destroy({ where: { set_num: setNum } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

// Exporting the functions as a module
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes, addSet, editSet, deleteSet };


