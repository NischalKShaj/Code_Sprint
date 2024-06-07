// file for the profile of the user and tutor profile repository

// importing the required modules
const UserCollection = require("../../../core/entities/user/userCollection");

// creating the profile repository
const profileRepository = {
  userProfile: async (userId) => {
    try {
      console.log("id", userId);
      const userData = await UserCollection.findById({ _id: userId });
      console.log("userData", userData);
      if (userData) {
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },
};

module.exports = profileRepository;
