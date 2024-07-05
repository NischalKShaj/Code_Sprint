// file to create the use case for the problem use case

// importing the required modules
const problemRepository = require("../../../infrastructure/repositories/problemRepository/problemRepository");

// create the use case for the problems
const problemUseCase = {
  // use case for getting the language and the difficulty
  getDifficultyAndCategory: async () => {
    try {
      const response = await problemRepository.getDifficultyAndCategory();
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for adding different languages
  addCategory: async (category) => {
    try {
      const response = await problemRepository.addCategory(category);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },
};

module.exports = problemUseCase;
