// file to add different languages for solving the problems

// importing the required modules
const mongoose = require("mongoose");

// creating the schema for the languages
const languageCollection = new mongoose.Schema({
  languageId: {
    type: Number,
    default: 13,
  },
  language: {
    type: String,
    default: "javascript",
  },
});

module.exports = mongoose.model("language", languageCollection);
