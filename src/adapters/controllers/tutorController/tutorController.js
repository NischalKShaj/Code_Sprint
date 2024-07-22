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
        const files = req.files;
        console.log("files", files);

        const course = req.body;
        console.log("course Data", course);

        if (!files || Object.keys(files).length === 0) {
          return res
            .status(400)
            .json({ success: false, data: "No files uploaded" });
        }

        const chapters = [];

        // Iterate over the chapters in req.body
        for (let i = 0; i < course.chapters.length; i++) {
          const chapterName = course.chapters[i].chapter_name;
          const chapterFiles = files[`chapters[${i}][files]`];

          // Ensure chapterFiles exist and handle as needed
          if (Array.isArray(chapterFiles) && chapterFiles.length > 0) {
            const formattedVideos = chapterFiles.map((file) => file.location);
            chapters.push({
              chapter_name: chapterName,
              videos: formattedVideos,
            });
          } else if (chapterFiles) {
            chapters.push({
              chapter_name: chapterName,
              videos: [chapterFiles.location], // Single file location
            });
          } else {
            return res.status(400).json({
              success: false,
              data: `No files uploaded for chapter ${i}`,
            });
          }
        }

        console.log("Organized Chapters: ", chapters);

        // Call your use case function to add course
        const result = await tutorUseCase.addCourses(
          course,
          chapters,
          userDetails
        );
        if (result.success) {
          console.log("Success", result);
          // Example of sending a message to a queue
          await sendMessageToQueue({ course, chapters, userDetails });
          return res.status(202).json(result.data);
        } else {
          console.error("Error", result.data);
          return res.status(400).json(result.data);
        }
      } catch (error) {
        console.error("Error", error);
        return res.status(500).json("Internal server error");
      }
    });
  },

  // show the specific course of the tutor
  getMyCourse: async (req, res) => {
    try {
      const courseId = req.params.id;
      console.log("id", courseId);
      const response = await tutorUseCase.getMyCourse(courseId);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for getting all the subscribers
  getAllUsers: async (req, res) => {
    try {
      const id = req.params.id;
      console.log("id", id);
      const response = await tutorUseCase.getAllUsers(id);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(400).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = tutorController;
