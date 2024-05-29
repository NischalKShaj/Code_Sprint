// file to show the tutors controller

// importing the required modules for the files
const tutorUseCase = require("../../application/usecase/tutorUseCase");

const tutorController = {
  // file to create new course
  addCourse: async (req, res) => {
    try {
      const courseDetails = req.body;
      const courses = await tutorUseCase.addCourses(courseDetails);
    } catch (error) {}
  },
};

module.exports = tutorController;
