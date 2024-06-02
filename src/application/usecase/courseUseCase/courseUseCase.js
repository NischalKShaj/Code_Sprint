// file for creating the use case for the courses

// import the required modules
const courseRepository = require("../../../infrastructure/repositories/courseRepository/courseRepository");

const courseUseCase = {
  // use case for finding all the courses
  findAllCourses: async () => {
    try {
      const courses = await courseRepository.findAllCourses();
      if (courses) {
        return { success: true, data: courses };
      } else {
        return { success: false, data: null };
      }
    } catch (error) {
      return { success: false, data: "internal server error" };
    }
  },
};

module.exports = courseUseCase;
