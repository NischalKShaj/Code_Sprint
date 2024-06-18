// file to implement the controller for the profile section

// importing the required modules
const profileUseCase = require("../../../application/usecase/profileUseCase/profileUseCase");

// creating the profile Controller for the user and the tutor
const profileController = {
  // controller for getting the user profile page
  postUserProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      console.log("userId", userId);
      const response = await profileUseCase.userProfile(userId);
      console.log("response", response);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for getting the tutor profile Page
  postTutorProfile: async (req, res) => {
    try {
      const tutorId = req.params.id;
      const response = await profileUseCase.tutorProfile(tutorId);
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

module.exports = profileController;
