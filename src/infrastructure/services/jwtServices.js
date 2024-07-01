// file to implement the jwt tokens

// importing the required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// creating the jwt tokens
module.exports.generateJWT = (userEmail, role = "user") => {
  // console.log("email", email);
  return jwt.sign({ email: userEmail, role }, process.env.SECRET, {
    expiresIn: "4h",
  });
};

// creating the jwt token for the admin
module.exports.adminGenerateJWT = (adminEmail, role = "admin") => {
  return jwt.sign({ email: adminEmail, role }, process.env.ADMIN_SECRET, {
    expiresIn: "4h",
  });
};
