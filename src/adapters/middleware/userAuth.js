// file to verify the jwt tokens used for the user
const jwt = require("jsonwebtoken");

// setting the middleware for the verification of the jwt
module.exports.authenticateUserJwt = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log("token", token);
  if (!token) {
    return res.status(401).json("unauthorized user");
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json("invalid token");
    }
    req.user = user;
    next();
  });
};
