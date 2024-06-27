// file to show the repository for courses
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const UserCollection = require("../../../core/entities/user/userCollection");
const CategoryCollection = require("../../../core/entities/category/category");

// creating courses repository
const courseRepository = {
  // method for finding specific course for the tutor side
  findCourses: async (tutorId) => {
    try {
      const tutor = await TutorCollection.findOne({ _id: tutorId });
      console.log("tutor", tutor);
      const myVideos = tutor.course;
      console.log(myVideos);
      if (myVideos) {
        return myVideos;
      } else {
        return null;
      }
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },

  // Method in course repository to find all courses
  findAllCourses: async () => {
    try {
      const courses = await CourseCollection.find();
      return courses;
    } catch (error) {
      console.error("Error in findAllCourses repository:", error);
      throw error;
    }
  },

  // Method in course repository to search courses by query
  searchCourses: async (query) => {
    try {
      const regexPattern = new RegExp(query, "i");
      const courses = await CourseCollection.find({
        course_name: regexPattern,
      });
      return courses;
    } catch (error) {
      console.error("Error in searchCourses repository:", error);
      throw error;
    }
  },

  // Method in course repository to filter courses by price range
  findCoursesByPriceRange: async (minPrice, maxPrice) => {
    try {
      const courses = await CourseCollection.find({
        price: { $gte: minPrice, $lte: maxPrice },
      });
      return courses;
    } catch (error) {
      console.error("Error in findCoursesByPriceRange repository:", error);
      throw error;
    }
  },

  // method to show the specific course as well as to check whether the course is subscribed or not
  showCourse: async (courseId, id) => {
    try {
      const courses = await CourseCollection.findById({ _id: courseId });
      const user = await UserCollection.findById({ _id: id });
      console.log("user", user);
      console.log("course", courses);

      // for checking whether the user schema has the course
      const subCourse = user.courses.some(
        (course) => course.courseId.toString() === courseId.toString()
      );

      console.log("subCourse", subCourse);

      if (courses) {
        return { courses, subCourse };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for showing the specific course for the editing purpose and all
  getMyCourse: async (courseId) => {
    try {
      const courseData = await CourseCollection.findById({ _id: courseId });
      console.log("courseData", courseData);
      if (courseData) {
        return courseData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for editing the course
  editCourse: async (courseData, courseVideos, tutorId) => {
    try {
      const id = courseData.courseId;
      const courseDetails = await CourseCollection.findById({ _id: id });
      const tutor = await TutorCollection.findById({ _id: tutorId });

      if (tutor && courseDetails) {
        // Merge existing videos with new ones
        const existingVideos = courseDetails.videos;
        const newVideos = courseVideos.map((video) => `${video.location}a`);
        const updatedVideos = [...existingVideos, ...newVideos];

        // Update course details
        courseDetails.course_name = courseData.course_name;
        courseDetails.course_category = courseData.course_category;
        courseDetails.description = courseData.description;
        courseDetails.price = parseInt(courseData.price, 10);
        courseDetails.videos = updatedVideos;

        await courseDetails.save();

        // Update tutor's course videos
        const courseIndex = tutor.course.findIndex(
          (course) => course.courseId.toString() === id.toString()
        );
        if (courseIndex !== -1) {
          tutor.course[courseIndex].title = courseData.course_name;
          tutor.course[courseIndex].category = courseData.course_category;
          tutor.course[courseIndex].description = courseData.description;
          tutor.course[courseIndex].url = updatedVideos;
        }

        await tutor.save();

        return courseDetails;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for extracting the interested courses
  getInterestedCourse: async (userId) => {
    try {
      const userData = await UserCollection.findOne({ _id: userId });
      console.log("user", userData);
      if (!userData) {
        return null;
      }
      const interested = userData.interests;

      const courseCategory = await CategoryCollection.find({
        _id: { $in: interested },
      });

      const category = courseCategory.map((category) => category.category_name);

      const interestedCourse = await CourseCollection.find({
        course_category: { $in: category },
      });

      if (interestedCourse && interestedCourse.length > 0) {
        return interestedCourse;
      }

      // if no interested courses are there then return all course
      const allCourse = await CourseCollection.find();
      console.log("all course", allCourse);
      return allCourse;
    } catch (error) {
      throw error;
    }
  },

  // method for deleting the course from the course collection and the tutor collection
  deleteCourse: async (userId, courseId) => {
    try {
      const tutor = await TutorCollection.findById({ _id: userId });
      console.log("tutor", tutor);
      if (!tutor) {
        return null;
      }
      // Find the index of the course in the tutor's course array
      const courseIndex = tutor.course.findIndex(
        (c) => c.courseId.toString() === courseId.toString()
      );
      if (courseIndex === -1) {
        throw new Error("Course not found in tutor's course array");
      }

      // Remove the course from the tutor's course array
      tutor.course.splice(courseIndex, 1);

      // Save the updated tutor document
      await tutor.save();

      await CourseCollection.findByIdAndDelete(courseId);
      let message = "course deleted successfully";
      return message;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = courseRepository;
