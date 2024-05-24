// file to implement the routes for the user

// importing the required modules
const express = require("express");
const router = express.Router();
const userController = require("../../../adapters/controllers/userController");

// creating the required routes
router.get("/", userController.getHome);
router.post("/login", userController.getLogin);

// exporting the module
module.exports = router;
