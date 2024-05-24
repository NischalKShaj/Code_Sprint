// file for showcasing the users use-cases

// importing the required modules
const userRepository = require("../../infrastructure/repositories/userRepository");

// creating the user use-case
const userUseCase = {
  //creating the user
  getHome: async () => {
    return await userRepository.getAllUser();
  },

  // for login purpose
  findUser: async (user) => {
    return await userRepository.findUser(user);
  },

  // for creating new user
  userSignup: async (userData) => {
    try {
      const newUser = await userRepository.createUser(userData);
      console.log("userUseCase", newUser);
      if (newUser) {
        return { success: true, data: "user sign-up success" };
      } else {
        return { success: false, data: "user with same email exists" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = userUseCase;
