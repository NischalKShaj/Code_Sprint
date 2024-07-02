const mongoose = require("mongoose");
const chapterSchema = require("../chapter/chapter"); // Ensure you have exported chapterSchema correctly

const courseSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: true,
    },
    course_category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    chapters: [chapterSchema],
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },
    totalSubscribed: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
