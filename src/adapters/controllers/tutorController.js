const upload = require("../../infrastructure/services/aws/s3bucket");
const tutorUseCase = require("../../application/usecase/tutorUseCase");

const tutorController = {
  addCourse: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ success: false, data: err.message });
      }
      try {
        const courseDetails = req.files;
        console.log("courseDetails", courseDetails);

        if (!courseDetails) {
          return res
            .status(400)
            .json({ success: false, data: "No files uploaded" });
        }

        const courses = await tutorUseCase.addCourses(courseDetails);
        if (courses.success) {
          console.log("success", courses);
          res.status(200).json(courses.data);
        } else {
          console.error("error", courses.data);
          res.status(400).json(courses.data);
        }
      } catch (error) {
        console.error("error", error);
        res.status(500).json("internal server error");
      }
    });
  },
};

module.exports = tutorController;
