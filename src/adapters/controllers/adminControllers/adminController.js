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
};

module.exports = adminController;
