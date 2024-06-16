// file for the admin use-cases

// importing all the required modules
const adminRepository = require("../../../infrastructure/repositories/adminRepository/adminRepository");
const generateJWT = require("../../../infrastructure/services/jwtServices");

// creating the admin use case
const adminUseCase = {
  // use-case for admin login
  adminLogin: async (data) => {
    try {
      const response = await adminRepository.adminLogin(data);
      if (response) {
        const token = generateJWT.adminGenerateJWT(data.email);
        return { success: true, data: response, token };
      } else {
        return { success: false, data: "invalid email" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },
  // use-case for finding all the users
  findAllUsers: async () => {
    try {
      const response = await adminRepository.findAllUsers();
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: "no user found for the request" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },
  // use-case for finding all the tutors
  findAllTutor: async () => {
    try {
      const response = await adminRepository.findAllTutor();
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: "no tutors found" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },
  // use-case for block and unblock
  blockUnblock: async (tutor) => {
    try {
      console.log("tutor", tutor);
      const response = await adminRepository.blockUnblock(tutor);
      console.log("response", response);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      return { success: false, data: "internal server error" };
    }
  },

  // use-case for block and unblock user
  userBlockUnblock: async (user) => {
    try {
      const response = await adminRepository.userBlockUnblock(user);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      return { success: false, data: "internal server error" };
    }
  },

  // use-case for showing all the graphs in the admin side
  adminGraphs: async () => {
    try {
      const response = await adminRepository.adminGraphs();
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },
};

module.exports = adminUseCase;
