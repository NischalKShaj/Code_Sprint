// file for the profile of the user and tutor profile repository

// importing the required modules
const UserCollection = require("../../../core/entities/user/userCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");

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
};

module.exports = profileRepository;
