// file for the problems controller

// importing the required modules
const problemUseCase = require("../../../application/usecase/problemUseCase/problemUseCase");

// creating the controller for the problems
const problemController = {
  // controller for getting the difficulty and the languages
  getDifficultyAndLanguage: async (req, res) => {
    try {
      const response = await problemUseCase.getDifficultyAndLanguage();
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
  addLanguage: async (req, res) => {
    try {
      const { language, id } = req.body;
      console.log("lang and id", language, id);
      const response = await problemUseCase.addLanguage(language, id);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },
};

module.exports = problemController;
