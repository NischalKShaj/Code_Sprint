// file for showcasing the users use-cases

// importing the required modules
const userRepository = require("../../infrastructure/repositories/userRepository");

// creating the user use-case
const userUseCase = {
  //creating the user
  createUser: async () => {
    return await userRepository.getAllUser();
  },
};

module.exports = userUseCase;
