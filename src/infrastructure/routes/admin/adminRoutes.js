// file to define the admin routes

// importing the required modules for the admin side
const express = require("express");
const router = express.Router();
const adminController = require("../../../adapters/controllers/adminControllers/adminController");

// defining all the required routes
router.post("/", adminController.adminLogin);

// exporting the routes
module.exports = router;
