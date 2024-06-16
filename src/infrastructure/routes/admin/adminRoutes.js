// file to define the admin routes

// importing the required modules for the admin side
const express = require("express");
const router = express.Router();
const adminController = require("../../../adapters/controllers/adminControllers/adminController");
const {
  authenticateAdminJwt,
} = require("../../../adapters/middleware/adminAuth");

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

// router for logging out
router.get("/logout", adminController.adminLogout);

// exporting the routes
module.exports = router;
