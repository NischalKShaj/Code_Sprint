// file to create the controller for chats

// importing the required modules
const messageUseCase = require("../../../application/usecase/messageUseCase/messageUseCase");

// creating the controller for chats
const messageController = {
  // controller for getting the conversation b/w the sender and the receiver
  getConversation: async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
      const response = await messageUseCase.getConversation(
        senderId,
        receiverId
      );
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

// exporting the controller
module.exports = messageController;
