// file to implement the routes for the user

// importing the required modules
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

// creating the required routes
router.get("/", userController.getHome);

// exporting the module
module.exports = router;
