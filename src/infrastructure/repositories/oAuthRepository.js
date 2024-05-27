// file for the oAuth repository

// import all the required modules
const UserCollection = require("../../core/entities/userCollection");
const bcryptjs = require("bcryptjs");

// creating the repository for the oAuth
const oAuthRepository = {
  // method for registering and logging in the user according to the oAuth
  oAuth: async (userData) => {
    try {
      const userDetail = await UserCollection.findOne({
        email: userData.email,
      });
      if (userDetail) {
        return userData;
      } else {
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = new UserCollection({
          username: userData.name,
          email: userData.email,
          password: hashedPassword,
          profile: userData.image,
        });
        await user.save();
        return user;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = oAuthRepository;
