// file to create the controller for chats

// importing the required modules

// creating the controller
const messageController = {
  // controller for sending the message
  sendMessage: async (req, res) => {
    try {
      console.log("hello");
      const { name, message } = req.body;
      console.log("name, message", name, message);
      if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required" });
      }

      // Emit the message to all connected clients
      req.app.get("io").emit("message", { name, message });

      res
        .status(200)
        .json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

// exporting the controller
module.exports = messageController;
