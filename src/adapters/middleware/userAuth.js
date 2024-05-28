// file to verify the jwt tokens used for the user
const jwt = require("jsonwebtoken");

// setting the middleware for the verification of the jwt
module.exports.authenticateUserJwt = (req, res, next) => {
  const token = req.cookie.access_token;
  if (!token) {
    return res.status(401).json("unauthorized user");
  }
  const user = jwt.verify(token, process.env.SECRET, (err, data) => {
    if (err) {
      return res.status(403).json("invalid token");
    }
    req.user = user;
    next();
  });
};
