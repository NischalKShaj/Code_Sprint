// file to create the schema for the daily problem

// importing the required modules
const mongoose = require("mongoose");

// defining the schema
const dailyProblem = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "problem",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("dailyProblem", dailyProblem);
