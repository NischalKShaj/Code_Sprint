// file for creating the use case for the courses

// import the required modules
const courseRepository = require("../../../infrastructure/repositories/courseRepository/courseRepository");
const userRepository = require("../../../infrastructure/repositories/userRepository/userRepository");

const courseUseCase = {
  // use case for finding all the courses
  findAllCourses: async () => {
    try {
      const courses = await courseRepository.findAllCourses();
      if (courses.length > 0) {
        return { success: true, data: courses };
      } else {
        return { success: false, data: "No courses found" };
      }
    } catch (error) {
      console.error("Error in findAllCourses use case:", error);
      return { success: false, data: "Internal server error" };
    }
  },

  // Use case for searching courses by query
  searchCourses: async (query) => {
    try {
      const courses = await courseRepository.searchCourses(query);
      if (courses.length > 0) {
        return { success: true, data: courses };
      } else {
        return { success: false, data: "No courses found" };
      }
    } catch (error) {
      console.error("Error in searchCourses use case:", error);
      return { success: false, data: "Internal server error" };
    }
  },

  // Use case for filtering courses by price range
  filterCoursesByPriceRange: async (minPrice, maxPrice) => {
    try {
      const courses = await courseRepository.findCoursesByPriceRange(
        minPrice,
        maxPrice
      );
      if (courses.length > 0) {
        return { success: true, data: courses };
      } else {
        return {
          success: false,
          data: "No courses found in the specified price range",
        };
      }
    } catch (error) {
      console.error("Error in filterCoursesByPriceRange use case:", error);
      return { success: false, data: "Internal server error" };
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

  // use case for finding course according to interest
  getInterestedCourse: async (userId) => {
    try {
      const result = await courseRepository.getInterestedCourse(userId);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error };
    }
  },

  // use case for deleting the courses
  deleteCourse: async (userId, courseId) => {
    try {
      const result = await courseRepository.deleteCourse(userId, courseId);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for showing all the courses in the admin side
  getAllCourse: async () => {
    try {
      const courses = await courseRepository.getAllCourse();
      if (courses.length > 0) {
        return { success: true, data: courses };
      } else {
        return { success: false, data: "No courses found" };
      }
    } catch (error) {
      console.error("Error in findAllCourses use case:", error);
      return { success: false, data: "Internal server error" };
    }
  },

  // use case for getting the specific course for showing in the admin side
  getCourse: async (courseId) => {
    try {
      const result = await courseRepository.getCourse(courseId);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: true, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = courseUseCase;
