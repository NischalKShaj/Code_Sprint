// file to create the schema for the user
const mongoose = require("mongoose");

// creating the schema for the daily problem
const dailyProblemSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "problem",
  },
  date: {
    type: Date,
    required: true,
  },
});

// creating schema for the user
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "problem",
        default: [],
      },
    ],
    dailyProblems: [dailyProblemSchema],
    streak: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
    },
    role: {
      type: String,
      default: "student",
    },
    interests: [
      {
        type: String,
        default: [],
      },
    ],
    premium: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// exporting the collection
module.exports = new mongoose.model("users", users);
