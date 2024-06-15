// file to show the repository for courses
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const UserCollection = require("../../../core/entities/user/userCollection");

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
};

module.exports = courseRepository;
