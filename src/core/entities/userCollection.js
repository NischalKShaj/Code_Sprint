// file to create the schema for the user
const mongoose = require("mongoose");

// creating schema for the database
const users = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default:
        "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg",
    },
    course: {
      type: [String],
      default: [],
    },
    tutors: {
      type: [String],
      default: [],
    },
    problems: {
      type: [String],
      default: [],
    },
    dailyProblems: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// exporting the collection
module.exports = new mongoose.model("users", users);
