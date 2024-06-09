// file to show the repository for courses
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");

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

  // method to find all the courses
  findAllCourses: async () => {
    try {
      const course = await CourseCollection.find();
      if (course) {
        return course;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  showCourse: async (courseId) => {
    try {
      const courses = await CourseCollection.findById({ _id: courseId });
      console.log("course", courses);
      if (courses) {
        return courses;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = courseRepository;
