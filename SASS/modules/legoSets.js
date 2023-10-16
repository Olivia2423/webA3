/********************************************************************************
* BTI325 – Assignment 02
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Olivia Christy Kuitchoua Kewang Student ID: 167357219 Date: 09/29/2023
*
********************************************************************************/


const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];


function initialize() {
    return new Promise((resolve, reject) => {
      try {
        sets = setData.map((set) => {
          const themeId = set.theme_id;
          const theme = themeData.find((theme) => theme.id === themeId);
          return {
            ...set,
            theme: theme ? theme.name : "Unknown Theme",
          };
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  

// Function to get all sets
function getAllSets() {
  return new Promise((resolve) => {
    resolve(sets);
  });
}

// Function to get a set by its set number
function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    const foundSet = sets.find((set) => set.set_num === setNum);
    if (foundSet) {
      resolve(foundSet);
    } else {
      reject("Unable to find requested set");
    }
  });
}

// Function to get sets by theme (case-insensitive and partial matching)
function getSetsByTheme(theme) {
  return new Promise((resolve) => {
    const matchingSets = sets.filter(
      (set) =>
        set.theme.toLowerCase().includes(theme.toLowerCase()) ||
        theme.toLowerCase().includes(set.theme.toLowerCase())
    );
    resolve(matchingSets);
  });
}

// Exporting the functions as a module
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

//Test the functions
initialize()
  .then(() => {
    console.log("Initialization complete.");
    return getAllSets();
  })
  .then((allSets) => {
    console.log("All sets:");
    console.log(allSets);
    return getSetByNum("001-1");
  })
  .then((setByNum) => {
    console.log("Set by number:");
    console.log(setByNum);
    return getSetsByTheme("tech");
  })
  .then((setsByTheme) => {
    console.log("Sets by theme:");
    console.log(setsByTheme);
  })
  .catch((error) => {
    console.error("Error:", error);
  });


// const setData = require("../data/setData");
// const themeData = require("../data/themeData");

// let sets = [];

// function initialize() {
//   return new Promise((resolve, reject) => {
//     setData.forEach(setElement => {
//       let setWithTheme = { ...setElement, theme: themeData.find(themeElement => themeElement.id == setElement.theme_id).name }
//       sets.push(setWithTheme);
//       resolve();
//     });
//   });

// }

// function getAllSets() {
//   return new Promise((resolve, reject) => {
//     resolve(sets);
//   });
// }

// function getSetByNum(setNum) {

//   return new Promise((resolve, reject) => {
//     let foundSet = sets.find(s => s.set_num == setNum);

//     if (foundSet) {
//       resolve(foundSet)
//     } else {
//       reject("Unable to find requested set");
//     }

//   });

// }

// function getSetsByTheme(theme) {

//   return new Promise((resolve, reject) => {
//     let foundSets = sets.filter(s => s.theme.toUpperCase().includes(theme.toUpperCase()));

//     if (foundSets) {
//       resolve(foundSets)
//     } else {
//       reject("Unable to find requested sets");
//     }

//   });

// }

// module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }
