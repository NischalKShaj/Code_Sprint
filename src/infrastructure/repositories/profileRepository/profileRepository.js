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
      console.log("tutorData", tutorData);

      // for extracting the user and corresponding subscribed course
      const subscribers = await Promise.all(
        tutorData.subscribers.map(async (sub) => {
          const user = await UserCollection.findById(sub.userId);
          const course = await CourseCollection.findById(sub.courseId);

          return {
            userId: sub.userId.toString(),
            username: user ? user.username : "User not found",
            email: user ? user.email : "Email not found",
            courseId: sub.courseId.toString(),
            courseTitle: course ? course.course_name : "Course not found",
          };
        })
      );

      const wallet = tutorData.wallet;

      console.log("subscribers", subscribers);

      if (tutorData) {
        return { tutorData, subscribers, wallet };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // methods for showing the subscribers chart
  getGraphs: async (tutorId) => {
    try {
      const tutorData = await TutorCollection.findOne({ _id: tutorId });
      console.log("tutorData", tutorData);

      // for filtering the monthly and yearly data
      const subscriptionDates = tutorData.subscribers.map((subscriber) => {
        const subscriptionDate = new Date(subscriber.subscriptionDate);
        const month = subscriptionDate.getMonth() + 1; // +1 because getMonth() returns 0-based index
        const year = subscriptionDate.getFullYear();
        return { month, year };
      });

      console.log("subscription date", subscriptionDates);
      return subscriptionDates;
    } catch (error) {
      throw error;
    }
  },

  // method for editing the tutor data
  editTutor: async (tutorData, profileImage, tutorId) => {
    try {
      const tutor = {
        username: tutorData.username,
        email: tutorData.email,
        phone: tutorData.phone,
      };

      if (profileImage) {
        tutor.profileImage = profileImage;
      }
      const tutorDetails = await TutorCollection.findByIdAndUpdate(
        tutorId,
        tutor,
        { new: true }
      );
      if (tutorDetails) {
        return tutorDetails;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = profileRepository;
