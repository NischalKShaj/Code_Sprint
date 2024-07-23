// file to create the repository for the conversation b/w the sender and the receiver

// importing the required modules
const MessageCollection = require("../../../core/entities/conversation/conversationCollection");
const UserCollection = require("../../../core/entities/user/userCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");

// creating the repository for messages
const messageRepository = {
  getConversation: async (senderId, receiverId) => {
    try {
      // checking if there is a conversation b/w the sender and the receiver
      const conversation = await MessageCollection.findOne({
        $or: [
          { studentId: senderId, tutorId: receiverId },
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

  // method for saving the conversation to the database
  saveConversation: async (senderId, receiverId, message, createdAt) => {
    try {
      // Extract the sender's role from UserCollection or TutorCollection
      let sender = await UserCollection.findOne({ _id: senderId }, { role: 1 });
      let senderRole, receiverRole;

      if (sender) {
        senderRole = sender.role === "student" ? "student" : "tutor";
        receiverRole = sender.role === "student" ? "tutor" : "student";
      } else {
        sender = await TutorCollection.findOne({ _id: senderId }, { role: 1 });
        if (sender) {
          senderRole = "tutor";
          receiverRole = "student";
        } else {
          throw new Error("Sender not found");
        }
      }

      // Check if the conversation already exists
      let conversation = await MessageCollection.findOne({
        $or: [
          {
            studentId: senderRole === "student" ? senderId : receiverId,
            tutorId: senderRole === "tutor" ? senderId : receiverId,
          },
          {
            studentId: senderRole === "student" ? receiverId : senderId,
            tutorId: senderRole === "tutor" ? receiverId : senderId,
          },
        ],
      });

      // If the conversation exists, push the new message to the conversation array
      if (conversation) {
        conversation.conversation.push({
          senderId,
          senderModel: senderRole,
          receiverId,
          receiverModel: receiverRole,
          message,
          createdAt,
        });
      } else {
        // If the conversation does not exist, create a new conversation
        conversation = new MessageCollection({
          studentId: senderRole === "student" ? senderId : receiverId,
          tutorId: senderRole === "tutor" ? senderId : receiverId,
          conversation: [
            {
              senderId,
              senderModel: senderRole,
              receiverId,
              receiverModel: receiverRole,
              message,
              createdAt,
            },
          ],
        });
      }

      // Save the conversation
      await conversation.save();
      return conversation;
    } catch (error) {
      console.error("Error saving conversation:", error);
      throw error;
    }
  },
};

// exporting the repository
module.exports = messageRepository;
