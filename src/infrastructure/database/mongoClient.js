// file for implementing the logic for the connection with the mongodb server

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    // Determine which URI to use based on the environment
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_CLOUD_URI
        : process.env.MONGODB_LOCAL_URI;

    if (!mongoURI) {
      throw new Error(
        "MongoDB URI is not defined in the environment variables"
      );
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("error while connecting the mongodb", error);
    process.exit(1);
  }
};

module.exports = connectDB;
