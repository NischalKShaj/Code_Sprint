const mongoose = require("mongoose");

// defining a schema for chapters within the course schema
const chapterSchema = new mongoose.Schema({
  chapterName: {
    type: String,
    required: true,
  },
  videos: [
    {
      type: String,
      required: true,
    },
  ],
});

// defining a module schema for courses within the tutor schema
const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  chapters: [chapterSchema],
});

// defining the tutor schema
const tutorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
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
    otp: {
      type: String,
    },
    course: [
      {
        type: moduleSchema,
        default: [],
      },
    ],
    role: {
      type: String,
      default: "tutor",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    subscribers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        subscriptionDate: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    wallet: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// exporting the collection
module.exports = mongoose.model("Tutor", tutorSchema);
