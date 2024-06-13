// file to implement the routes for the user

// importing the required modules
const express = require("express");
const router = express.Router();
const {
  authenticateUserJwt,
} = require("../../../adapters/middleware/userAuth");
const userController = require("../../../adapters/controllers/userController/userController");
const tutorController = require("../../../adapters/controllers/tutorController/tutorController");
const oAuthController = require("../../../adapters/controllers/oAuthController/oAuthController");
const courseController = require("../../../adapters/controllers/courseController/courseController");
const profileController = require("../../../adapters/controllers/profileController/profileController");

// creating the required routes

// router for getting the home page
router.get("/", userController.getHome);

// router for posting the login details
router.post("/login", userController.getLogin);

// router for posting the signup details
router.post("/signup", userController.postSignup);

// router for posting the otp
router.post("/otp", userController.validateOtp);

// router for otp resend
router.post("/otp/resend", userController.resendOtp);

// router for google auth
router.post("/api/google", oAuthController.postOAuth);

// router for github auth
router.post("/api/github", oAuthController.postOAuth);

// router for performing the logout
router.get("/logout", userController.logoutUser);

// router for getting the courses for the tutor
router.get("/mycourse/:id", authenticateUserJwt, tutorController.getCourse);

// router to add new courses
router.post("/uploads", authenticateUserJwt, tutorController.addCourse);

// router for getting the course page
router.get("/courses", authenticateUserJwt, courseController.findAllCourses);

// router for getting the profile page
router.get(
  "/profile/user/:id",
  authenticateUserJwt,
  profileController.postUserProfile
);

// router for getting the single course
router.get("/courses/:id", authenticateUserJwt, courseController.showCourse);

// exporting the module
module.exports = router;
