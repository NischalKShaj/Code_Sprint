// router for chat

// importing the required modules
const express = require("express");
const router = express.Router();
const {
  authenticateUserJwt,
} = require("../../../adapters/middleware/userAuth");
const upload = require("../../../adapters/middleware/multer");
const messageController = require("../../../adapters/controllers/messageController/messageController");

// creating the routes for the message

// router for getting the conversation between the sender and the receiver
router.get(
  "/get-conversation/:senderId/:receiverId",
  authenticateUserJwt,
  messageController.getConversation
);

module.exports = router;
