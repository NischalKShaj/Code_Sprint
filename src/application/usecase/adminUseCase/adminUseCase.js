// file for the admin use-cases

// importing all the required modules
const adminRepository = require("../../../infrastructure/repositories/adminRepository/adminRepository");

// creating the admin use case
const adminUseCase = {
  adminLogin: async (data) => {
    try {
      const response = await adminRepository.adminLogin(data);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: "invalid email" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },
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
};

module.exports = adminUseCase;
