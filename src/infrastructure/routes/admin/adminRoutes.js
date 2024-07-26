// file to define the admin routes

// importing the required modules for the admin side
const express = require("express");
const router = express.Router();
const upload = require("../../../adapters/middleware/multer");
const adminController = require("../../../adapters/controllers/adminControllers/adminController");
const {
  authenticateAdminJwt,
} = require("../../../adapters/middleware/adminAuth");
const bannerController = require("../../../adapters/controllers/bannerController/bannerController");
const payoutController = require("../../../adapters/controllers/payoutController/payoutController");
const categoryController = require("../../../adapters/controllers/categoryController/categoryController");
const problemController = require("../../../adapters/controllers/problemController/problemController");
const courseController = require("../../../adapters/controllers/courseController/courseController");

// defining all the required routes

// route for getting the admin login
router.post("/", adminController.adminLogin);

// router for getting the user details
router.get("/users", authenticateAdminJwt, adminController.findAllUser);

// router for getting the tutor details
router.get("/tutors", authenticateAdminJwt, adminController.findAllTutor);

// router for blocking and unblocking the tutor
router.patch(
  "/tutor/:id",
  authenticateAdminJwt,
  adminController.tutorBlockUnblock
);

// router for blocking and unblocking the user
router.patch(
  "/user/:id",
  authenticateAdminJwt,
  adminController.userBlockUnblock
);

// router for getting the details for the graph
router.get("/graphs", authenticateAdminJwt, adminController.adminGraphs);

// router for getting the banner
router.get("/banner", authenticateAdminJwt, bannerController.showBanners);

// router for posting the values in the banner
router.post(
  "/add_banner",
  upload.single("banner"),
  authenticateAdminJwt,
  bannerController.addBanner
);

// router for getting the banner for editing
router.get("/banner/:id", authenticateAdminJwt, bannerController.showBanner);

// router for editing the banner
router.put(
  "/banner/:id",
  upload.single("bannerImage"),
  authenticateAdminJwt,
  bannerController.editBanner
);

// router for deleting the banner
router.delete(
  "/banner/delete/:id",
  authenticateAdminJwt,
  bannerController.deleteBanner
);

// router for getting the payouts
router.get(
  "/payout-request",
  authenticateAdminJwt,
  payoutController.showPayouts
);

// router for posting and confirming the payment
router.post(
  "/update-payout-status",
  authenticateAdminJwt,
  payoutController.confirmPayment
);

// router for getting all the categories
router.get("/category", authenticateAdminJwt, categoryController.showCategory);

// router for adding new categories
router.post(
  "/addCategory",
  authenticateAdminJwt,
  categoryController.addCategory
);

// router for adding the languages
router.post(
  "/problems/addCategory",
  authenticateAdminJwt,
  problemController.addCategory
);

// router for getting the difficulty and the languages
router.get(
  "/problems/addProblems/categoryAndDifficulty",
  authenticateAdminJwt,
  problemController.getDifficultyAndCategory
);

// router for verifying test cases
router.post(
  "/addProblem/verifyTestCase",
  authenticateAdminJwt,
  problemController.verifyTestCase
);

// router for adding the problem
router.post(
  "/problem/addProblem",
  authenticateAdminJwt,
  problemController.addProblem
);

// router for showing all the problems
router.get("/problems", authenticateAdminJwt, problemController.showProblems);

// router for showing the daily problems
router.get(
  "/problem/dailyProblems",
  authenticateAdminJwt,
  problemController.showDailyProblems
);

// router for getting all the courses
router.get("/all-courses", authenticateAdminJwt, courseController.getAllCourse);

// router for getting the particular course
router.get("/courses/:id", authenticateAdminJwt, courseController.getCourse);

// router for logging out
router.get("/logout", adminController.adminLogout);

// exporting the routes
module.exports = router;
