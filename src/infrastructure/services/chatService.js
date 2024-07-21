// file to implement the socket connection for the chat service

// importing the required modules
const { Server } = require("socket.io");

const chatService = {
  init: (server) => {
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected`);

      socket.on("sendMessage", (message) => {
        console.log("Message received:", message);
        io.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`);
      });

      socket.on("error", (err) => {
        console.error("Socket.IO error:", err);
      });
    });
  },
};

module.exports = chatService;
