// file for the users controller
const userUseCase = require("../../application/usecase/userUseCase");

// creating the controller for the user
const userController = {
  // creating the controller for the initial landing page
  getHome: async (req, res) => {
    await userUseCase.createUser();
    res.status(200).json("home page");
  },
  getLogin: async (req, res) => {
    const user = req.body;
    console.log(user);
    await userUseCase.findUser(user);
    res.status(200).json("login page");
  },
};

// exporting the controller
module.exports = userController;
