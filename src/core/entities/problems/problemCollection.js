// file to create the schema for the problems

// importing the required module for the schema
const mongoose = require("mongoose");

// creating the schema
const problems = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  language: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "language",
      required: true,
    },
  ],
  problemType: [
    {
      type: [String],
      enum: ["Array", "String"],
      required: true,
    },
  ],
  testCase: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "testCase",
      required: true,
    },
  ],
  mainCode: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("problem", problems);
