// file for the admin controller

// importing the required modules for the project
const adminUseCase = require("../../../application/usecase/adminUseCase/adminUseCase");

// creating the controller
const adminController = {
  adminLogin: async (req, res) => {
    try {
      const data = req.body;
      console.log("data", data);
      const result = await adminUseCase.adminLogin(data);
      if (result.success) {
        console.log("result", result);
        res.status(200).json(result.data);
      } else {
        res.status(401).json(result.data);
      }
    } catch (error) {
      console.error("error");
      res.status(500).json("internal server error");
    }
  },
  findAllUser: async (req, res) => {
    try {
      const response = await adminUseCase.findAllUsers();
      if (response.success) {
        console.log("data", response);
        res.status(200).json(response.data);
      } else {
        res.status(401).json(response.data);
      }
    } catch (error) {
      console.error("error", error);
      res.status(500).json(response.data);
    }
  },
  findAllTutor: async (req, res) => {
    try {
      const response = await adminUseCase.findAllTutor();
      if (response.success) {
        console.log("data", response.data);
        res.status(200).json(response.data);
      } else {
        res.status(401).json(response.data);
      }
    } catch (error) {
      console.error("error", error);
      res.status(500).json(response.data);
    }
  },
};

module.exports = adminController;
