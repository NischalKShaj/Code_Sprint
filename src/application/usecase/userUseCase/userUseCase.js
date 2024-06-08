// file for showcasing the users use-cases

// importing the required modules
const userRepository = require("../../../infrastructure/repositories/userRepository/userRepository");
const generateJWT = require("../../../infrastructure/services/jwtServices");

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
      console.log("result", result);
      if (result) {
        const token = generateJWT.generateJWT(result.email);
        return { success: true, data: result, token };
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

  // for otp resending
  resendOtp: async (userEmail, newOTP) => {
    try {
      const user = await userRepository.resendOtp(userEmail, newOTP);
      if (user) {
        return { success: true, data: user };
      } else {
        return { success: false, data: "otp resending failed" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },
};

module.exports = userUseCase;