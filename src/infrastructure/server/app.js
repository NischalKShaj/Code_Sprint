// file for starting the server
// importing the packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("../database/connect");
const userRouter = require("../../adapters/routes/user/userRoutes");
dotenv.config();

// configuring the app
const app = express();

// setting the port for the server
const port = process.env.PORT;

// setting the routes
app.use("/", userRouter);

// starting the server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
