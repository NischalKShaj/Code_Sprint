// file to create the repository for the problems

// importing the required modules
const ProblemCollection = require("../../../core/entities/problems/problemCollection");
const LanguageCollection = require("../../../core/entities/languages/languageCollection");

// helper function to get the difficulty
const getDifficulty = (schema, path) => {
  const enumValues = schema.path(path).enumValues;
  return enumValues;
};

// creating the problems repository
const problemRepository = {
  // method for getting the language and the difficulty for the question
  getDifficultyAndLanguage: async () => {
    try {
      const language = await LanguageCollection.find({}, { language: 1 });
      console.log("langs", language);

      const difficulty = getDifficulty(ProblemCollection.schema, "difficulty");
      console.log("difficulty", difficulty);
      if (language && difficulty) {
        return { language, difficulty };
      } else {
        null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for adding new language
  addLanguage: async (language, id) => {
    try {
      const languageData = new LanguageCollection({
        languageId: id,
        language: language,
      });
      await languageData.save();
      console.log("language", languageData);
      if (languageData) {
        return languageData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = problemRepository;
