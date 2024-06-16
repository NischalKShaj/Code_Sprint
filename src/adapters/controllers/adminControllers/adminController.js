// file for the admin controller

// importing the required modules for the project
const adminUseCase = require("../../../application/usecase/adminUseCase/adminUseCase");

// creating the controller
const adminController = {
  // controller for admin login
  adminLogin: async (req, res) => {
    try {
      const data = req.body;
      console.log("data", data);
      const result = await adminUseCase.adminLogin(data);
      if (result.success) {
        console.log("result", result);
        res
          .cookie("admin_access_token", result.token, { httpOnly: true })
          .status(202)
          .json({ data: result.data, token: result.token });
      } else {
        res.status(401).json(result.data);
      }
    } catch (error) {
      console.error("error");
      res.status(500).json("internal server error");
    }
  },

  // controller to find all the users
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

  // controller to find all the tutor
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

  // controller for block and unblock
  tutorBlockUnblock: async (req, res) => {
    try {
      const tutor = req.params.id;
      console.log("id", tutor);
      const response = await adminUseCase.blockUnblock(tutor);
      console.log("responseData", response.data);
      if (response.success) {
        console.log("response", response.data);
        res.status(200).json(response.data);
      } else {
        res.status(401).json(response.data);
      }
    } catch (error) {
      console.error("error", error);
      res.status(500).json(response.data);
    }
  },

  // controller for user block and unblock
  userBlockUnblock: async (req, res) => {
    try {
      const user = req.params.id;
      console.log("user", user);
      const response = await adminUseCase.userBlockUnblock(user);
      console.log("response", response);
      if (response.success) {
        res.clearCookie("access_token").status(200).json(response.data);
      } else {
        res.status(401).json(response.data);
      }
    } catch (error) {
      res.status(500).json(response.data);
    }
  },

  // controller for getting the graphs for the admin dashboard
  adminGraphs: async (req, res) => {
    try {
      const response = await adminUseCase.adminGraphs();
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(response.data);
    }
  },

  // controller for admin logout
  adminLogout: (req, res) => {
    res
      .clearCookie("admin_access_token")
      .status(200)
      .json("admin logout success");
  },
};

module.exports = adminController;
