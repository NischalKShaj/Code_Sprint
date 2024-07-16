// file to implement the profile use case for the user and the admin

// importing all the required module
const profileRepository = require("../../../infrastructure/repositories/profileRepository/profileRepository");

// creating the required use-case
const profileUseCase = {
  // use case for the user profile
  userProfile: async (userId) => {
    try {
      console.log("usr", userId);
      const response = await profileRepository.userProfile(userId);
      console.log("res", response);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      return { success: false, data: "internal server error" };
    }
  },

  // use case for the tutor profile
  tutorProfile: async (tutorId) => {
    try {
      const response = await profileRepository.tutorProfile(tutorId);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, data: "internal server error" };
    }
  },

  // graphs for tutor to show the subscribers graphs
  getGraphs: async (tutorId) => {
    try {
      const response = await profileRepository.getGraphs(tutorId);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // for editing the tutor data
  editTutor: async (tutorData, profileImage, tutorId) => {
    try {
      const result = await profileRepository.editTutor(
        tutorData,
        profileImage,
        tutorId
      );
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for getting all the solved problems
  getSolvedProblems: async (id) => {
    try {
      const result = await profileRepository.getSolvedProblems(id);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },
};

module.exports = profileUseCase;
