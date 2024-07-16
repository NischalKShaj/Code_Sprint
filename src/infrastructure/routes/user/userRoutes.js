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
const payoutController = require("../../../adapters/controllers/payoutController/payoutController");
const categoryController = require("../../../adapters/controllers/categoryController/categoryController");
const problemController = require("../../../adapters/controllers/problemController/problemController");
const upload = require("../../../adapters/middleware/multer");

// creating the required routes

// router for getting the home page
router.get("/", userController.getHome);

// router for posting the login details
router.post("/login", userController.getLogin);

// router for getting categories during signup
router.get("/modal/category", categoryController.showCategory);

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

// router for online payment
router.post("/api/razorpay", userController.handler);

// router for verifying the payment
router.post("/api/payment-success", userController.verifyPayment);

// router for performing the logout
router.get("/logout", userController.logoutUser);

// router for getting the courses for the tutor
router.get("/mycourse/:id", authenticateUserJwt, tutorController.getCourse);

// router for getting the single course page for the tutor
router.get(
  "/mycourse/course/:id",
  authenticateUserJwt,
  tutorController.getMyCourse
);

// routers to add new courses
router.post("/uploads", authenticateUserJwt, tutorController.addCourse);

// router for getting the category while adding new course
router.get("/category", authenticateUserJwt, categoryController.showCategory);

// router for getting the course page
router.get("/courses", authenticateUserJwt, courseController.findAllCourses);

// router for getting the user profile page
router.get(
  "/profile/user/:id",
  authenticateUserJwt,
  profileController.postUserProfile
);

// router for getting the single course
router.post("/courses/:id", authenticateUserJwt, courseController.showCourse);

// router for updating the userDetails
router.put(
  "/profile/edit/:id",
  upload.single("profileImage"),
  authenticateUserJwt,
  userController.editStudent
);

// router for getting the tutor profile page
router.get(
  "/profile/tutor/:id",
  authenticateUserJwt,
  profileController.postTutorProfile
);

// router for showing the tutor graph
router.get("/user/graph/:id", authenticateUserJwt, profileController.getGraph);

// router for editing the tutor
router.put(
  "/profile/tutor/edit/:id",
  upload.single("profileImage"),
  authenticateUserJwt,
  profileController.editTutor
);

// router for showing the solved problems
router.get(
  "/profile/user/solutions/:id",
  authenticateUserJwt,
  profileController.getSolvedProblems
);

// router for unsubscribing the course
router.post(
  "/course/unsubscribe/:id",
  authenticateUserJwt,
  userController.unSubscribe
);

// router for editing the courses
router.put(
  "/course/edit/:id",
  authenticateUserJwt,
  courseController.editCourse
);

// router for deleting the courses
router.delete(
  "/course/delete/:id",
  authenticateUserJwt,
  courseController.deleteCourse
);

// router for sending the payout request for the admin
router.post(
  "/payout-request",
  authenticateUserJwt,
  payoutController.addPaymentRequest
);

// router for getting the interested courses
router.get(
  "/interested-course",
  authenticateUserJwt,
  courseController.getInterestedCourse
);

// router for showing all the course in home page
router.get("/suggested", courseController.getInterestedCourse);

// router for adding premium subscription
router.post(
  "/premium-subscription",
  authenticateUserJwt,
  payoutController.premiumSubscription
);

// router for getting all the problems
router.get("/problems", authenticateUserJwt, problemController.showProblems);

// router for getting the categories and difficulties
router.get(
  "/category_difficulty",
  authenticateUserJwt,
  problemController.getDifficultyAndCategory
);

// router for getting the showing the specific problem
router.get("/problems/:id", authenticateUserJwt, problemController.showProblem);

// router for checking the test cases
router.post(
  "/problem/execute",
  authenticateUserJwt,
  problemController.checkTestCase
);

// router for submitting the problem
router.post(
  "/problem/submit",
  authenticateUserJwt,
  problemController.problemSubmission
);

// exporting the module
module.exports = router;
