// file to define the admin routes

// importing the required modules for the admin side
const express = require("express");
const router = express.Router();
const adminController = require("../../../adapters/controllers/adminControllers/adminController");

// defining all the required routes
router.post("/", adminController.adminLogin);
router.post("/users", adminController.findAllUser);
router.post("/tutors", adminController.findAllTutor);
router.post("/tutor/:id", adminController.tutorBlockUnblock);
router.post("/user/:id", adminController.userBlockUnblock);
router.get("/logout", adminController.adminLogout);

// exporting the routes
module.exports = router;