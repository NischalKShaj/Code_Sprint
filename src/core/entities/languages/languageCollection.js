// file to add different languages for solving the problems

// importing the required modules
const mongoose = require("mongoose");

// creating the schema for the languages
const languageCollection = new mongoose.Schema({
  languageId: {
    type: Number,
    required: true,
    default: 63,
  },
  language: {
    type: String,
    required: true,
    default: "JavaScript",
  },
});

module.exports = new mongoose.model("language", languageCollection);
