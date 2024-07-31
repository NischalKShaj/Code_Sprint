// file for showcasing the tutors use-cases

// importing the required modules
const tutorRepository = require("../../../infrastructure/repositories/tutorRepository/tutorRepository");
const courseRepository = require("../../../infrastructure/repositories/courseRepository/courseRepository");
// const multer = require("../../../infrastructure/services/aws/s3bucket");

// creating the use case for tutor
const tutorUseCase = {
  // for login
  findTutor: async (userData) => {
    try {
      const result = await tutorRepository.findTutor(userData);
      console.log("result inside here", result);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: "invalid credentials" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for tutor signup
  tutorSignup: async (userData) => {
    try {
      const newUser = await tutorRepository.createTutor(userData);
      console.log("newUser", newUser);
      if (newUser) {
        return { success: true, data: "user sign-up success" };
      } else {
        return { success: false, data: "user with same email exists" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for validating the otp and registering the tutor
  validateOtp: async (userOtp) => {
    try {
      const newUser = await tutorRepository.validateOtp(userOtp);
      if (newUser) {
        return { success: true, data: "tutor signup success" };
      } else {
        return { success: false, data: "user not found" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for adding the courses
  addCourses: async (course, courseDetails, userDetails) => {
    try {
      const userData = await tutorRepository.addCourses(
        course,
        courseDetails,
        userDetails
      );
      if (userData) {
        return { success: true, data: "videos uploaded" };
      } else {
        return { success: false, data: "videos uploading failed" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },

  // for finding the courses for the specific tutor
  findCourses: async (tutor) => {
    try {
      const course = await courseRepository.findCourses(tutor);
      if (course) {
        return { success: true, data: course };
      } else {
        return { success: false, data: "no courses" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },

  // for showing the specific course
  getMyCourse: async (courseId) => {
    try {
      const result = await courseRepository.getMyCourse(courseId);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: "internal server error" };
    }
  },

  // use case for finding all the subscribers
  getAllUsers: async (id) => {
    try {
      const result = await tutorRepository.getAllUsers(id);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = tutorUseCase;
