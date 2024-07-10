// file for the problems controller

// importing the required modules
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
  showProblem: async (req, res) => {
    try {
      const response = await problemUseCase.showProblem();
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = problemController;
