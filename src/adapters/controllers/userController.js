// file for the users controller
const userUseCase = require("../../core/usecase/userUseCase");

// creating the controller for the user
const userController = {
  // creating the controller for the initial landing page
  getHome: async (req, res) => {
    await userUseCase.createUser();
    res.status(200).json("home page");
  },
};

// exporting the controller
module.exports = userController;
