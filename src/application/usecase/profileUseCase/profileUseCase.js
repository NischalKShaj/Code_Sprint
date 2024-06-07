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
};

module.exports = profileUseCase;
