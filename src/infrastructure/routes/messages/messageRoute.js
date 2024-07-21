// router for chat

// importing the required modules
const express = require("express");
const router = express.Router();
const {
  authenticateUserJwt,
} = require("../../../adapters/middleware/userAuth");
const messageController = require("../../../adapters/controllers/messageController/messageController");

// creating the routes for the message
router.post("/sendMessage", messageController.sendMessage);

module.exports = router;
