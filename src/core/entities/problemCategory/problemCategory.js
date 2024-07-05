// file to add the different category of the problems

// importing the required modules
const mongoose = require("mongoose");

// creating the schema for the category
const problemCategory = new mongoose.Schema({
  category_name: {
    type: String,
  },
});

module.exports = new mongoose.model("problemCategory", problemCategory);
