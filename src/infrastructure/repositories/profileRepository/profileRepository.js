// file for the profile of the user and tutor profile repository

// importing the required modules
const UserCollection = require("../../../core/entities/user/userCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const ProblemCollection = require("../../../core/entities/problems/problemCollection");

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

  // method for showing all the solved problems
  getSolvedProblems: async (id) => {
    try {
      const user = await UserCollection.findById(
        { _id: id },
        { problems: 1, _id: 0 }
      );
      console.log("user", user);

      solvedProblems = user.problems;

      const problems = await ProblemCollection.find(
        {
          _id: { $in: solvedProblems },
        },
        { title: 1, category: 1, difficulty: 1, _id: 1 }
      );

      // extracting the difficulty of the solved problems
      const solvedProblemsDifficulty = problems.reduce((acc, problem) => {
        const { difficulty } = problem;
        if (difficulty) {
          acc[difficulty] = (acc[difficulty] || 0) + 1;
        }
        return acc;
      }, {});

      console.log("solved", solvedProblemsDifficulty);

      // for getting all the problems difficulty
      const allProblems = await ProblemCollection.find(
        {},
        { difficulty: 1, _id: 0 }
      );

      // extracting the count of each difficulty from all the problems
      const difficultyCounts = allProblems.reduce((acc, problem) => {
        const { difficulty } = problem;
        if (difficulty) {
          acc[difficulty] = (acc[difficulty] || 0) + 1;
        }
        return acc;
      }, {});

      console.log("diff", difficultyCounts);

      console.log("problem", problems);

      if (problems) {
        return { problems, difficultyCounts, solvedProblemsDifficulty };
      } else {
        return "no problems solved";
      }
    } catch (error) {
      throw error;
    }
  },

  // method for getting the streak for the user
  getStreak: async (id) => {
    try {
      const user = await UserCollection.findById({ _id: id });
      if (!user) {
        throw new Error("user not found");
      }

      // For getting today's date at midnight
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // For getting yesterday's date at midnight
      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1);

      // Retrieve all daily problems for the user
      const dailyProblems = user.dailyProblems;

      // Function to check if there was any submission on a specific date
      const hasSubmissionOnDate = (date) => {
        return dailyProblems.some((entry) => {
          const submissionDate = new Date(entry.date);
          submissionDate.setUTCHours(0, 0, 0, 0);
          return submissionDate.getTime() === date.getTime();
        });
      };

      // Checking whether there was any submission today
      const hasSubmissionToday = hasSubmissionOnDate(today);

      // Checking whether there was any submission yesterday
      const hasSubmissionYesterday = hasSubmissionOnDate(yesterday);

      console.log("today", hasSubmissionToday);
      console.log("yesterday", hasSubmissionYesterday);

      let newStreak;

      if (hasSubmissionYesterday) {
        if (hasSubmissionToday) {
          newStreak = user.streak + 1;
        } else {
          newStreak = user.streak;
        }
      } else {
        if (hasSubmissionToday) {
          newStreak = 1;
        } else {
          newStreak = 0;
        }
      }

      user.streak = newStreak;
      await user.save();

      console.log("user streak", newStreak);
      return newStreak;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = profileRepository;
