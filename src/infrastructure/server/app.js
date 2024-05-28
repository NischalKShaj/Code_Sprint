// file for starting the server
// importing the packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("../database/connect");
const cors = require("cors");
const userRouter = require("../routes/user/userRoutes");
const cookieParser = require("cookie-parser");
dotenv.config();

// configuring the app
const app = express();

// setting the port for the server
const port = process.env.PORT;

// configuring the cookie-parser
app.use(cookieParser());

// enabling cors policy for the application
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// for passing the data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting the routes
app.use("/", userRouter);

// starting the server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
