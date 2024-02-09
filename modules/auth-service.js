const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
require('dotenv').config();

const Schema = mongoose.Schema;

// Define userSchema
const userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: { type: Date, default: Date.now },
      userAgent: String,
    }
  ],
});

let User; // to be defined on new connection (see initialize)

// Export the userSchema and User model
module.exports = { userSchema, User };


// auth-service.js
function initialize() {
  return new Promise(function (resolve, reject) {
    const dbUri = process.env.MONGODB_URI; // Ensure process.env.MONGODB_URI is defined in your .env file

    if (!dbUri) {
      reject("MongoDB connection string is not defined.");
      return;
    }

    let db = mongoose.createConnection(process.env.MONGODB_URI);

    db.on('error', (err) => {
      reject(err);
    });

    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
}

  
  // Export the initialize function
 module.exports.initialize = initialize;


  // auth-service.js
  function registerUser(userData) {
    return new Promise(function (resolve, reject) {
      // Check if passwords match
      if (userData.password !== userData.password2) {
        reject("Passwords do not match");
      } else {
        // Hash the password before saving to the database
        bcrypt.hash(userData.password, 10)
          .then((hash) => {
            // Replace the plain text password with the hashed version
            userData.password = hash;
  
            // Create a new User from userData
            let newUser = new User(userData);
            // Save the user to the database
            newUser.save()
              .then(() => resolve())
              .catch((err) => {
                // Handle duplicate key error
                console.error('Error in registerUser:', err);
                if (err.code === 11000) {
                  reject("User Name already taken");
                } else {
                  reject(`There was an error creating the user: ${err}`);
                }
              });
          })
          .catch((err) => {
            console.error('Error hashing password:', err);
            reject("There was an error encrypting the password");
          });
      }
    });
  }

// Export the registerUser function
module.exports.registerUser = registerUser;


// auth-service.js
function checkUser(userData) {
    return new Promise(function (resolve, reject) {
      // Find the user in the database
      User.find({ userName: userData.userName })
        .then((users) => {
          if (users.length === 0) {
            reject(`Unable to find user: ${userData.userName}`);
          } else {
            // Compare the hashed password in the database with the entered password
            bcrypt.compare(userData.password, users[0].password)
              .then((result) => {
                if (!result) {
                  reject(`Incorrect Password for user: ${userData.userName}`);
                } else {
                  // Record login history
                  if (users[0].loginHistory.length === 8) {
                    users[0].loginHistory.pop();
                  }
                  users[0].loginHistory.unshift({
                    dateTime: (new Date()).toString(),
                    userAgent: userData.userAgent
                  });
  
                  // Update login history in the database
                  User.updateOne({ userName: users[0].userName }, { $set: { loginHistory: users[0].loginHistory } })
                    .then(() => resolve(users[0]))
                    .catch((err) => reject(`There was an error verifying the user: ${err}`));
                }
              })
              .catch((err) => reject(`Error comparing passwords: ${err}`));
          }
        })
        .catch((err) => reject(`Unable to find user: ${userData.userName}`));
    });
}
  
  // Export the checkUser function
  module.exports.checkUser = checkUser;
  