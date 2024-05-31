// database for the courses
const mongoose = require("mongoose");

// creating the schema for the course database
const course = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: true,
    },
    course_category: {
      type: String,
      required: true,
    },
    number_of_videos: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: String,
        required: true,
      },
    ],
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tutorCollection",
      required: true,
    },
  },
  { timestamps: true }
);

// exporting the modules
module.exports = new mongoose.model("course", course);
