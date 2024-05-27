// file to implement the routes for the user

// importing the required modules
const express = require("express");
const router = express.Router();
const userController = require("../../../adapters/controllers/userController");
const oAuthController = require("../../../adapters/controllers/oAuthController");

// creating the required routes
router.get("/", userController.getHome);
router.post("/login", userController.getLogin);
router.post("/signup", userController.postSignup);
router.post("/otp", userController.validateOtp);
router.post("/api/google", oAuthController.postOAuth);
router.post("/api/github", oAuthController.postOAuth);

// exporting the module
module.exports = router;
