// file for the users controller
const userUseCase = require("../../application/usecase/userUseCase");

// creating the controller for the user
const userController = {
  // creating the controller for the initial landing page
  getHome: async (req, res) => {
    await userUseCase.getHome();
    res.status(200).json("home page");
  },

  //controller for getting the login page
  getLogin: async (req, res) => {
    const user = req.body;
    console.log(user);
    try {
      const details = await userUseCase.findUser(user);
      if (details.success) {
        res.status(202).json("user logged successfully");
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for getting the signup page
  postSignup: async (req, res) => {
    try {
      const userData = req.body;
      const result = await userUseCase.userSignup(userData);
      console.log("controller", result);
      if (result.success) {
        res.status(201).json(result.data);
      } else {
        res.status(409).json(result.data);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  },
};

// exporting the controller
module.exports = userController;
