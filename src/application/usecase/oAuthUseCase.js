// file for showcasing the users signed using oAuth

// importing the required modules
const oAuthRepository = require("../../infrastructure/repositories/oAuthRepository");

// creating the oAuth Usecase
const OAuthUseCase = {
  // method for the OAuth
  oAuth: async (userData) => {
    try {
      const result = await oAuthRepository.oAuth(userData);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: "user not found" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = OAuthUseCase;
