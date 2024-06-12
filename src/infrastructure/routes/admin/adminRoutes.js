// file to define the admin routes

// importing the required modules for the admin side
const express = require("express");
const router = express.Router();
const adminController = require("../../../adapters/controllers/adminControllers/adminController");
const {
  authenticateAdminJwt,
} = require("../../../adapters/middleware/adminAuth");

// defining all the required routes
router.post("/", adminController.adminLogin);
router.post("/users", authenticateAdminJwt, adminController.findAllUser);
router.post("/tutors", authenticateAdminJwt, adminController.findAllTutor);
router.post(
  "/tutor/:id",
  authenticateAdminJwt,
  adminController.tutorBlockUnblock
);
router.post(
  "/user/:id",
  authenticateAdminJwt,
  adminController.userBlockUnblock
);
router.get("/logout", adminController.adminLogout);

// exporting the routes
module.exports = router;
