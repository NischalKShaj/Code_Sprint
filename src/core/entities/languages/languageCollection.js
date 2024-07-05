// file to add different languages for solving the problems

// importing the required modules
const mongoose = require("mongoose");

// creating the schema for the languages
const languageCollection = new mongoose.Schema({
  languageId: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("language", languageCollection);
