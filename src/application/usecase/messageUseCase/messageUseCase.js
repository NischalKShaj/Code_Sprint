// file for creating the use case for the messages

// importing the required modules
const messageRepository = require("../../../infrastructure/repositories/messageRepository/messageRepository");

// creating the use case
const messageUseCase = {
  // use case for getting the old conversations
  getConversation: async (senderId, receiverId) => {
    try {
      const result = await messageRepository.getConversation(
        senderId,
        receiverId
      );
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // use case for adding the conversation to the database
  saveConversation: async (senderId, receiverId, message, createdAt) => {
    try {
      console.log("data", senderId, receiverId, message, createdAt);
      let result = await messageRepository.saveConversation(
        senderId,
        receiverId,
        message,
        createdAt
      );
      console.log("result", result);
    } catch (error) {
      console.error("error", error);
    }
  },
};

// exporting the use case
module.exports = messageUseCase;
