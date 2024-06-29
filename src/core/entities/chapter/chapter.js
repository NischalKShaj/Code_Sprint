const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

module.exports = chapterSchema;
