// file to create the schema for the user
const mongoose = require("mongoose");

// creating schema for the database
const temporaryUsers = new mongoose.Schema(
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
    courses: {
      type: [
        {
          courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
          },
          tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tutor",
            required: true,
          },
        },
      ],
      default: [],
    },
    problems: [
      {
        type: String,
        default: [],
      },
    ],
    dailyProblems: [
      {
        type: String,
        default: [],
      },
    ],
    otp: {
      type: String,
    },
    interests: [
      {
        type: String,
        default: [],
      },
    ],
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
);

// exporting the collection
module.exports = new mongoose.model("temporaryUsers", temporaryUsers);
