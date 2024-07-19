// file for the problems controller

// importing the required modules
const { response } = require("express");
const problemUseCase = require("../../../application/usecase/problemUseCase/problemUseCase");

// creating the controller for the problems
const problemController = {
  // controller for getting the difficulty and the languages
  getDifficultyAndCategory: async (req, res) => {
    try {
      const response = await problemUseCase.getDifficultyAndCategory();
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(response.data);
    }
  },

  // controller for adding language
  addCategory: async (req, res) => {
    try {
      console.log("first");
      const { category } = req.body;
      console.log("lang and id", category);
      const response = await problemUseCase.addCategory(category);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for verifying the language
  verifyTestCase: async (req, res) => {
    try {
      const { main, testInput, expectedOutput } = req.body;
      const response = await problemUseCase.verifyTestCase(
        main,
        testInput,
        expectedOutput
      );
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for adding the problem
  addProblem: async (req, res) => {
    try {
      const data = req.body;
      const response = await problemUseCase.addProblem(data);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for showing all the problems
  showProblems: async (req, res) => {
    try {
      const response = await problemUseCase.showProblems();
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller to show the specific program
  showProblem: async (req, res) => {
    try {
      const id = req.params.id;
      const response = await problemUseCase.showProblem(id);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller to verify the test cases
  checkTestCase: async (req, res) => {
    try {
      const { id, clientCode } = req.body;
      const response = await problemUseCase.checkTestCase(id, clientCode);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(400).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for code submission
  problemSubmission: async (req, res) => {
    try {
      const { id, clientCode, userId } = req.body;
      const response = await problemUseCase.problemSubmission(
        id,
        clientCode,
        userId
      );
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(400).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for getting the daily problems (Admin)
  showDailyProblems: async (req, res) => {
    try {
      const response = await problemUseCase.getDailyProblems();
      console.log("response from controller", response.data);
      if (response.success) {
        console.log("response from here", response.data);
        res.status(202).json(response.data);
      } else {
        console.log("response from here 404", response.data);

        res.status(400).json(response.data);
      }
    } catch (error) {
      console.log("response from here 500", response.data);

      res.status(500).json(error.message);
    }
  },

  // controller for getting the daily problem
  dailyProblem: async (req, res) => {
    try {
      const date = req.params.date;
      const response = await problemUseCase.dailyChallenge(date);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(400).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = problemController;
