// controller for managing courses

// imports for the files
const courseUseCase = require("../../../application/usecase/courseUseCase/courseUseCase");

const courseController = {
  // controller for finding all the courses
  findAllCourses: async (req, res) => {
    try {
      const result = await courseUseCase.findAllCourses();
      console.log("result", result);
      if (result.success) {
        console.log("result", result.data);
        res.status(200).json(result.data);
      } else {
        res.status(401).json(result.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },
};

module.exports = courseController;