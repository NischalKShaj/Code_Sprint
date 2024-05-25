// file for the user repository

// importing the modules required
const TemporaryUserCollection = require("../../core/entities/temporaryUserCollection");
const bcryptjs = require("bcryptjs");

// creating userRepository
const userRepository = {
  // method to get all the users
  getAllUser: async () => {
    const users = await TemporaryUserCollection.find();
    console.log("users");
  },

  // method for login
  findUser: async (user) => {
    const users = await use.email;
    console.log("user", user);
    if (user.email === users) {
      console.log("valid credentials");
    } else {
      console.log("invalid");
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
  validateUser: async (userData) => {
    try {
      const userOtp = userData.otp;
      const userDetail = await TemporaryUserCollection.findOne({
        otp: userOtp,
      });
      if (userDetail) {
        let user = new UserCollection({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          otp: userData.otp,
        });
        await user.save();
        console.log("user");
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
};

module.exports = userRepository;
