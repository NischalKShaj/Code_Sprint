// file for creating the use case for the courses

// import the required modules
const courseRepository = require("../../../infrastructure/repositories/courseRepository/courseRepository");
const userRepository = require("../../../infrastructure/repositories/userRepository/userRepository");

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
  showCourse: async (courseId, id) => {
    try {
      const course = await courseRepository.showCourse(courseId, id);
      if (course) {
        return { success: true, data: course };
      } else {
        return { success: false, data: null };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = courseUseCase;
