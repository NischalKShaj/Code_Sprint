// file for the user repository

// importing the modules required
const TemporaryUserCollection = require("../../../core/entities/temporary/temporaryUserCollection");
const UserCollection = require("../../../core/entities/user/userCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const bcryptjs = require("bcryptjs");

// creating userRepository
const userRepository = {
  // method to get all the users
  getAllUser: async () => {
    const users = await UserCollection.find();
    console.log("users");
  },

  // method for login
  findUser: async (user) => {
    try {
      const userEmail = user.email;
      const userPassword = user.password;
      const userDetails = await UserCollection.findOne({ email: userEmail });
      const tutorDetails = await TutorCollection.findOne({ email: userEmail });

      // Check if the user details exists and validate password
      if (
        userDetails &&
        bcryptjs.compareSync(userPassword, userDetails.password)
      ) {
        return userDetails;
      }

      // Check if tutor details exist and validate password
      if (
        tutorDetails &&
        bcryptjs.compareSync(userPassword, tutorDetails.password)
      ) {
        return tutorDetails;
      }

      // If neither match, return null
      return null;
    } catch (error) {
      console.log("error");
      throw error;
    }
  },

  // method for signup
  createUser: async (userData) => {
    try {
      const userEmail = userData.email;
      const userDetails = await UserCollection.findOne({ email: userEmail });
      if (!userDetails) {
        const hashedPassword = bcryptjs.hashSync(userData.password, 10);
        let userDetail = new TemporaryUserCollection({
          username: userData.username,
          email: userEmail,
          phone: userData.phone,
          password: hashedPassword,
          otp: userData.otp,
        });
        await userDetail.save();
        console.log(userDetail);
        return userDetail;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // method to check whether the user valid or not
  validateUser: async (userOtp) => {
    try {
      // const userOtp = userData.otp;
      const userDetail = await TemporaryUserCollection.findOne({
        otp: userOtp,
      });
      if (userDetail) {
        let user = new UserCollection({
          username: userDetail.username,
          email: userDetail.email,
          phone: userDetail.phone,
          password: userDetail.password,
          otp: userOtp,
        });
        await user.save();
        console.log("user", user);

        // removing the user from the temporary collection
        await TemporaryUserCollection.deleteOne({ otp: userOtp });
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // method for otp resending
  resendOtp: async (userEmail, newOTP) => {
    try {
      const user = await TemporaryUserCollection.findOne({ email: userEmail });
      if (user) {
        await TemporaryUserCollection.updateOne(
          { email: userEmail },
          { otp: newOTP }
        );
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userRepository;
