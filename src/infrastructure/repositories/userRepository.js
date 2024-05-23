// file for the user repository

// importing the modules required
const UserCollection = require("../../core/entities/userCollection");

// creating userRepository
const userRepository = {
  // method to get all the users
  getAllUser: async () => {
    const users = await UserCollection.find();
    console.log("users");
  },
};

module.exports = userRepository;
