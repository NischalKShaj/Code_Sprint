// file for the admin repository

// importing the required files
const UserCollection = require("../../../core/entities/user/userCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const dotenv = require("dotenv");
dotenv.config();

// creating admin repository
const adminRepository = {
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
};

module.exports = adminRepository;
