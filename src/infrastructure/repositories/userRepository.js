// file for the user repository

// importing the modules required
const UserCollection = require("../../core/entities/userCollection");
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
        let userDetail = new UserCollection({
          username: userData.username,
          email: userEmail,
          phone: userData.phone,
          password: hashedPassword,
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
};

module.exports = userRepository;
