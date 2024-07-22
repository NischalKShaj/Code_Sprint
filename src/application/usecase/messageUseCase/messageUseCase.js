// file for creating the use case for the messages

// importing the required modules
const messageRepository = require("../../../infrastructure/repositories/messageRepository/messageRepository");

// creating the use case
const messageUseCase = {
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
};

// exporting the use case
module.exports = messageUseCase;
