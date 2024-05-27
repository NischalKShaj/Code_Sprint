// file to implement the jwt tokens

// importing the required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// creating the jwt tokens
const generateJWT = (userEmail) => {
  return jwt.sign({ email: userEmail }, process.env.SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generateJWT;
