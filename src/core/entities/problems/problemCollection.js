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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    enum: "problemCategory",
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  testCase: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "testCase",
      required: true,
    },
  ],
  constrains: [
    {
      type: String,
    },
  ],
  clientCode: {
    type: String,
    required: true,
  },
  mainCode: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("problem", problems);
