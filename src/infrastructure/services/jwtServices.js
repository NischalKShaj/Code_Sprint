// file to implement the jwt tokens

// importing the required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// creating the jwt tokens
module.exports.generateJWT = (userEmail) => {
  // console.log("email", email);
  return jwt.sign({ email: userEmail }, process.env.SECRET, {
    expiresIn: "4h",
  });
};
