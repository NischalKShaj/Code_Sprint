// controller for managing courses

// imports for the files
const courseUseCase = require("../../../application/usecase/courseUseCase/courseUseCase");
const {
  upload,
  sendMessageToQueue,
} = require("../../../infrastructure/services/aws/s3bucket");

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

  // controller for showing the specific course
  showCourse: async (req, res) => {
    try {
      const courseId = req.params.id;
      const { id } = req.body;
      console.log(id);
      console.log("cid", courseId);
      const result = await courseUseCase.showCourse(courseId, id);
      if (result.success) {
        console.log("result", result.data);
        res.status(202).json(result.data);
      } else {
        res.status(401).json(result.data);
      }
    } catch (error) {
      console.error("error", error);
      res.status(500).json("internal server error");
    }
  },

  // controller for editing the course
  editCourse: async (req, res) => {
    try {
      const tutorId = req.params.id;

      upload(req, res, async (err) => {
        if (err) {
          console.error("error", err);
          res.status(500).json({ success: false, data: err.message });
        }
        const courseVideos = req.files;
        console.log("videos", courseVideos);

        const courseData = req.body;
        if (!courseVideos || courseVideos.length === 0) {
          return res
            .status(500)
            .json({ success: false, data: "no files uploaded" });
        }
        const response = await courseUseCase.editCourse(
          courseData,
          courseVideos,
          tutorId
        );
        if (response.success) {
          await sendMessageToQueue({ courseData, courseVideos, tutorId });
          res.status(202).json(response.data);
        } else {
          res.status(400).json(response.data);
        }
      });
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },
};

module.exports = courseController;
