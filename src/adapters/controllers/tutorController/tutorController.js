// file for tutor controller

// importing the required modules
const {
  upload,
  sendMessageToQueue,
} = require("../../../infrastructure/services/aws/s3bucket");
const tutorUseCase = require("../../../application/usecase/tutorUseCase/tutorUseCase");

const tutorController = {
  //controller for getting the page
  getCourse: async (req, res) => {
    try {
      const tutor = req.params.id;
      console.log("tutor", tutor);
      const course = await tutorUseCase.findCourses(tutor);
      console.log("course", course.data);
      if (course.success) {
        res.status(200).json(course.data);
      } else {
        res.status(400).json("no videos");
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for adding course
  addCourse: async (req, res) => {
    const userDetails = req.query.userEmail;
    console.log("userDetails", userDetails);

    upload(req, res, async (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ success: false, data: err.message });
      }

      try {
        const courseDetails = req.files;
        console.log("courseDetails", courseDetails);

        const course = req.body;
        console.log("course Data", course.course_name);

        if (!courseDetails || courseDetails.length === 0) {
          return res
            .status(400)
            .json({ success: false, data: "No files uploaded" });
        }

        const result = await tutorUseCase.addCourses(
          course,
          courseDetails,
          userDetails
        );
        if (result.success) {
          console.log("success", result);
          await sendMessageToQueue({ course, courseDetails, userDetails });
          res.status(202).json(result.data);
        } else {
          console.error("error", result.data);
          res.status(400).json(result.data);
        }
      } catch (error) {
        console.error("error", error);
        res.status(500).json("internal server error");
      }
    });
  },
};

module.exports = tutorController;
