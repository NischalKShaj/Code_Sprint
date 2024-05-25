// file for showcasing the tutors use-cases

// importing the required modules
const tutorRepository = require("../../infrastructure/repositories/tutorRepository");

// creating the use case for tutor
const tutorUseCase = {
  tutorSignup: async (userData) => {
    try {
      const newUser = await tutorRepository.createTutor(userData);
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

module.exports = tutorUseCase;
