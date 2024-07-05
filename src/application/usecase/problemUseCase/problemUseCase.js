// file to create the use case for the problem use case

// importing the required modules
const problemRepository = require("../../../infrastructure/repositories/problemRepository/problemRepository");

// create the use case for the problems
const problemUseCase = {
  // use case for getting the language and the difficulty
  getDifficultyAndLanguage: async () => {
    try {
      const response = await problemRepository.getDifficultyAndLanguage();
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
  addLanguage: async (language, id) => {
    try {
      const response = await problemRepository.addLanguage(language, id);
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
