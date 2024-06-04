// file for the admin repository

// importing the required files
const UserCollection = require("../../../core/entities/user/userCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const dotenv = require("dotenv");
dotenv.config();

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
};

module.exports = adminRepository;
