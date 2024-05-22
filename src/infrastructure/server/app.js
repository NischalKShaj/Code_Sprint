// file for starting the server
// importing the packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("../database/connect");
dotenv.config();

// configuring the app
const app = express();

const port = process.env.PORT;

// setting the routes
app.get("/", (req, res) => {
  res.send("hello");
});

// starting the server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
