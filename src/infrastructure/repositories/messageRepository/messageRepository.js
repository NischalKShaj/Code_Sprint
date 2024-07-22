// file to create the repository for the conversation b/w the sender and the receiver

// importing the required modules
const MessageCollection = require("../../../core/entities/conversation/conversationCollection");

// creating the repository for messages
const messageRepository = {
  getConversation: async (senderId, receiverId) => {
    try {
      // checking if there is a conversation b/w the sender and the receiver
      const conversation = await MessageCollection.findOne({
        $or: [
          { studentId: senderId, tutorId, receiverId },
          { studentId: receiverId, tutorId: senderId },
        ],
      });
      if (!conversation) {
        return null;
      }
      return conversation;
    } catch (error) {
      throw error;
    }
  },
};

// exporting the repository
module.exports = messageRepository;
