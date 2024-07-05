// file to add different languages for solving the problems

// importing the required modules
const mongoose = require("mongoose");

// creating the schema for the languages
const languageCollection = new mongoose.Schema({
  languageId: {
    type: Number,
    required: true,
    enum: [32, 71], // restrict to these values
    default: function () {
      // set a default value based on the language
      if (this.language === "javascript") return 32;
      if (this.language === "python") return 71;
      return null; // or handle error
    },
  },
  language: {
    type: String,
    required: true,
    enum: ["javascript", "python"], // restrict to these values
    default: "javascript", // default language
  },
});

module.exports = mongoose.model("language", languageCollection);
