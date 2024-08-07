// file for starting the server
// importing the packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("../database/connect");
const cors = require("cors");
const userRouter = require("../routes/user/userRoutes");
const adminRouter = require("../routes/admin/adminRoutes");
const messageRouter = require("../routes/messages/messageRoute");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const chatService = require("../services/chatService");
const cronJob = require("../services/dailyProblemService");
dotenv.config();

// configuring the app
const app = express();
const server = http.createServer(app);
chatService.init(server);

// configuring the scheduler
cronJob();

// setting the port for the server
const port = process.env.PORT || 4000;

// Serve static files from the uploads directory
app.use("/uploads", express.static("src/infrastructure/storage/uploads"));

// configuring the cookie-parser
app.use(cookieParser());

// enabling cors policy for the application
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// for passing the data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting the routes
app.use("/admin", adminRouter);
app.use("/message", messageRouter);
app.use("/", userRouter);

// starting the server
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
