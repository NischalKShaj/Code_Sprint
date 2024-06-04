// file to implement the routes for the user

// importing the required modules
const express = require("express");
const router = express.Router();
const token = require("../../../adapters/middleware/userAuth");
const userController = require("../../../adapters/controllers/userController/userController");
const tutorController = require("../../../adapters/controllers/tutorController/tutorController");
const oAuthController = require("../../../adapters/controllers/oAuthController/oAuthController");
const courseController = require("../../../adapters/controllers/courseController/courseController");

// creating the required routes
router.get("/", userController.getHome);
router.post("/login", userController.getLogin);
router.post("/signup", userController.postSignup);
router.post("/otp", userController.validateOtp);
router.post("/otp/resend", userController.resendOtp);
router.post("/api/google", oAuthController.postOAuth);
router.post("/api/github", oAuthController.postOAuth);
router.get("/logout", userController.logoutUser);
router.post("/mycourse/:id", tutorController.getCourse);
router.post("/uploads", tutorController.addCourse);
router.post("/courses", courseController.findAllCourses);

// exporting the module
module.exports = router;
