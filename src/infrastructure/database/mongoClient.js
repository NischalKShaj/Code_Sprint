// file for implementing the logic for the connection with the mongodb server

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/code_sprint", {
      useNewUrlParser: true,
      newUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("mongodb connected");
  } catch (error) {
    console.error("error while connecting the mongodb", error);
    process.exit(1);
  }
};

module.exports = connectDB;
