// file to create the category for the courses

// importing the required modules
const mongoose = require("mongoose");

// creating the schema
const category = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("category", category);
