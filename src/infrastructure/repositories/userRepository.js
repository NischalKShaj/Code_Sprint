// file for the user repository

// importing the modules required
const UserCollection = require("../../core/entities/userCollection");

let use = {
  email: "nischalkshaj5@gmail.com",
  password: "123",
};

// creating userRepository
const userRepository = {
  // method to get all the users
  getAllUser: async () => {
    const users = await UserCollection.find();
    console.log("users");
  },
  findUser: async (user) => {
    const users = await use.email;
    console.log("user", user);
    if (user.email === users) {
      console.log("valid credentials");
      // res.status(200).json("login success");
    } else {
      console.log("invalid");
      // res.status(201).json("login failed");
    }
  },
};

module.exports = userRepository;
