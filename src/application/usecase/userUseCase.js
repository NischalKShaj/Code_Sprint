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
    try {
      const result = await userRepository.findUser(user);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: "invalid credentials" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for creating new user
  userSignup: async (userData) => {
    try {
      const newUser = await userRepository.createUser(userData);
      console.log("userUseCase", newUser);
      if (newUser) {
        return { success: true, data: newUser };
      } else {
        return { success: false, data: "user with same email exists" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for validating the user
  validateUser: async (userOtp) => {
    try {
      const newUser = await userRepository.validateUser(userOtp);
      if (newUser) {
        return { success: true, data: newUser };
      } else {
        return { success: false, data: "user not found" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = userUseCase;
