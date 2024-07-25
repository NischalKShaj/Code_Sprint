// file for the admin repository

// importing the required files
const UserCollection = require("../../../core/entities/user/userCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const ProblemCollection = require("../../../core/entities/problems/problemCollection");
const dotenv = require("dotenv");
dotenv.config();

// Function to format date to "yyyy-month-date" format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" }); // Full month name
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

// creating admin repository
const adminRepository = {
  // method for admin login
  adminLogin: async (data) => {
    try {
      const email = data.email;
      const password = data.password;
      if (
        email === process.env.ADMIN_LOGIN &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for finding all the users
  findAllUsers: async () => {
    try {
      const userData = await UserCollection.find();
      console.log("userData", userData);
      if (userData) {
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for finding all the tutors
  findAllTutor: async () => {
    try {
      const tutorData = await TutorCollection.find();
      console.log("tutorData", tutorData);
      if (tutorData) {
        return tutorData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for blocking and unblocking the tutor
  blockUnblock: async (tutor) => {
    try {
      const tutorData = await TutorCollection.findOne({ _id: tutor });
      console.log("tutorData", tutorData);
      if (tutorData) {
        if (tutorData.blocked) {
          await TutorCollection.findByIdAndUpdate(tutor, { blocked: false });
          return { id: tutorData._id, status: tutorData.blocked };
        } else {
          await TutorCollection.findByIdAndUpdate(tutor, { blocked: true });
          return { id: tutorData._id, status: tutorData.blocked };
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for blocking and unblocking the user
  userBlockUnblock: async (user) => {
    try {
      const userData = await UserCollection.findOne({ _id: user });
      if (userData) {
        if (userData.blocked) {
          await UserCollection.findByIdAndUpdate(user, { blocked: false });
          return { id: userData._id, status: userData.blocked };
        } else {
          await UserCollection.findByIdAndUpdate(user, { blocked: true });
          return { id: userData._id, status: userData.blocked };
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for getting the chart in the dashboard
  adminGraphs: async () => {
    try {
      const userData = await UserCollection.find();
      const userGraphs = userData.map((user) => formatDate(user.createdAt));

      console.log("userGraph", userGraphs);

      const tutorData = await TutorCollection.find();
      const tutorGraphs = tutorData.map((tutor) => formatDate(tutor.createdAt));

      console.log("tutorGraph", tutorGraphs);

      const totalSubscribers = await CourseCollection.aggregate([
        {
          $project: {
            course_name: 1,
            totalSubscribed: 1,
          },
        },
        {
          $sort: { totalSubscribed: -1 }, // Sort by totalSubscribed in descending order
        },
        {
          $limit: 2, // Limit to the top 2 results
        },
      ]);

      console.log("total", totalSubscribers);

      const totalSolvedProblem = await ProblemCollection.aggregate([
        {
          $project: {
            title: 1,
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 3,
        },
      ]);

      console.log("solved", totalSolvedProblem);

      if (userGraphs && tutorGraphs) {
        return {
          userGraphs,
          tutorGraphs,
          totalSubscribers,
          totalSolvedProblem,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = adminRepository;
