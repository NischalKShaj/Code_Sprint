// file for creating the use case for the courses

// import the required modules
const courseRepository = require("../../../infrastructure/repositories/courseRepository/courseRepository");
const userRepository = require("../../../infrastructure/repositories/userRepository/userRepository");

const courseUseCase = {
  // use case for finding all the courses
  findAllCourses: async (query) => {
    try {
      let courses;
      if (query) {
        courses = await courseRepository.findAllCourses(query);
      } else {
        courses = await courseRepository.findAllCourses();
      }
      if (courses) {
        return { success: true, data: courses };
      } else {
        return { success: false, data: null };
      }
    } catch (error) {
      return { success: false, data: "internal server error" };
    }
  },

  // use case for showing the specific course
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

  // use case for editing the course
  editCourse: async (courseData, courseVideos, tutorId) => {
    try {
      const result = await courseRepository.editCourse(
        courseData,
        courseVideos,
        tutorId
      );
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: "internal server error" };
    }
  },
};

module.exports = courseUseCase;
