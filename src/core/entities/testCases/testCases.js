// file to create the test cases for the project

// importing the required modules
const mongoose = require("mongoose");

// creating the schema for the collection

// schema for entire testCases input and expected outputs
const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

// schema for showing the example test cases
const exampleTestCase = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

// schema for showing the test cases
const testCaseCollection = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "problems",
      required: true,
    },
    testCases: [testCaseSchema],
    exampleTest: [exampleTestCase],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("testCase", testCaseCollection);
