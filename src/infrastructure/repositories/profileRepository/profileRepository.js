// file for the profile of the user and tutor profile repository

// importing the required modules
const UserCollection = require("../../../core/entities/user/userCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");

// creating the profile repository
const profileRepository = {
  // method for showing the user profile
  userProfile: async (userId) => {
    try {
      console.log("id", userId);
      const userData = await UserCollection.findById({ _id: userId });
      console.log("userData", userData);
      const course_id = userData.courses.map((course) =>
        course.courseId.toString()
      );

      console.log("course Id", course_id);

      const subscribed = await CourseCollection.find({
        _id: { $in: course_id },
      });

      console.log("subscribed courses", subscribed);

      if (userData) {
        return { userData, subscribed };
      } else {
        return null;
      }
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },

  // method for getting the tutors profile page
  tutorProfile: async (tutorId) => {
    try {
      const tutorData = await TutorCollection.findById(tutorId);
      console.log("tutorData");
      if (tutorData) {
        return tutorData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = profileRepository;
