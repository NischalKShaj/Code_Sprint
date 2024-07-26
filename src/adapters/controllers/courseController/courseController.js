// controller for managing courses

// imports for the files
const courseUseCase = require("../../../application/usecase/courseUseCase/courseUseCase");
const {
  upload,
  sendMessageToQueue,
} = require("../../../infrastructure/services/aws/s3bucket");

const courseController = {
  // Controller for finding all the courses
  findAllCourses: async (req, res) => {
    try {
      const query = req.query.query; // Search query
      const maxPrice = req.query.maxPrice; // Maximum price filter
      const minPrice = req.query.minPrice; // Minimum price filter
      console.log("queryParams", query, maxPrice, minPrice);

      let result;

      if (query) {
        result = await courseUseCase.searchCourses(query);
      } else if (maxPrice && minPrice) {
        result = await courseUseCase.filterCoursesByPriceRange(
          minPrice,
          maxPrice
        );
      } else {
        result = await courseUseCase.findAllCourses();
      }

      if (result.success) {
        res.status(200).json(result.data); // Send back the data to the client
      } else {
        res.status(404).json({ error: "No courses found" });
      }
    } catch (error) {
      console.error("Error in findAllCourses controller:", error);
      res.status(500).json({ error: "Internal server error" });
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
      console.log("tutorId:", tutorId);

      upload(req, res, async (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ success: false, data: err.message });
        }

        const files = req.files;
        console.log("videos", files);
        const courseData = req.body;
        console.log("courseData:", courseData);

        // Prepare chapters array to update
        let chapters = [];

        // Iterate over the chapters in req.body, if any
        if (courseData.chapters && Array.isArray(courseData.chapters)) {
          for (let i = 0; i < courseData.chapters.length; i++) {
            const chapterName = courseData.chapters[i].chapterName;
            const chapterVideos = files[`chapters[${i}][files]`];

            if (chapterVideos) {
              const formattedVideos = Array.isArray(chapterVideos)
                ? chapterVideos.map((video) => video.location)
                : [chapterVideos.location];

              chapters.push({
                chapter_name: chapterName,
                videos: formattedVideos,
              });
            } else {
              // Handle case where no new videos are uploaded for a chapter
              const existingVideosKey = `chapters[${i}][files],`;
              if (courseData[existingVideosKey]) {
                const existingVideos = Array.isArray(
                  courseData[existingVideosKey]
                )
                  ? courseData[existingVideosKey]
                  : [courseData[existingVideosKey]];

                chapters.push({
                  chapter_name: chapterName,
                  videos: existingVideos,
                });
              }
            }
          }
        }

        console.log("Organized Chapters: ", chapters);

        // Proceed with updating course data
        const response = await courseUseCase.editCourse(
          courseData,
          chapters,
          tutorId
        );

        if (response.success) {
          // Only send message to queue if videos are uploaded
          if (files && Object.keys(files).length > 0) {
            await sendMessageToQueue({ courseData, chapters, tutorId });
          }
          return res.status(202).json(response.data);
        } else {
          return res.status(400).json(response.data);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json("Internal server error");
    }
  },

  // getting the courses based on the interests
  getInterestedCourse: async (req, res) => {
    try {
      const userId = req.query.id;
      console.log("first", userId);
      let response;
      if (userId) {
        response = await courseUseCase.getInterestedCourse(userId);
      } else {
        response = await courseUseCase.findAllCourses();
      }
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for deleting the courses
  deleteCourse: async (req, res) => {
    try {
      const userId = req.query.userId;
      const courseId = req.params.id;
      console.log(`1:${userId},2:${courseId}`);
      const response = await courseUseCase.deleteCourse(userId, courseId);
      if (response.success) {
        res.status(204).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for getting all the courses
  getAllCourse: async (req, res) => {
    try {
      const response = await courseUseCase.getAllCourse();
      if (response.success) {
        res.status(200).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for getting the specific course
  getCourse: async (req, res) => {
    try {
      const courseId = req.params.id;
      const result = await courseUseCase.getCourse(courseId);
      if (result.success) {
        res.status(202).json(result.data);
      } else {
        res.status(400).json(result.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = courseController;
