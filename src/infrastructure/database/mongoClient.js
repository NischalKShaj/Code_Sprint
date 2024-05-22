// file for implementing the logic for the connection with the mongodb server

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("mongodb connected");
  } catch (error) {
    console.error("error while connecting the mongodb", error);
    process.exit(1);
  }
};

module.exports = connectDB;
