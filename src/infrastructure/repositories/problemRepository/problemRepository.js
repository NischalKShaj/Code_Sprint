// file to create the repository for the problems

// importing the required modules
const ProblemCollection = require("../../../core/entities/problems/problemCollection");
const LanguageCollection = require("../../../core/entities/languages/languageCollection");
const CategoryCollection = require("../../../core/entities/problemCategory/problemCategory");

// helper function to get the difficulty
const getDifficulty = (schema, path) => {
  const enumValues = schema.path(path).enumValues;
  return enumValues;
};

// creating the problems repository
const problemRepository = {
  // method for getting the language and the difficulty for the question
  getDifficultyAndCategory: async () => {
    try {
      const category = await CategoryCollection.find({}, { category_name: 1 });
      console.log("langs", category);

      const difficulty = getDifficulty(ProblemCollection.schema, "difficulty");
      console.log("difficulty", difficulty);
      if (category && difficulty) {
        return { category, difficulty };
      } else {
        null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for adding new language
  addCategory: async (category) => {
    try {
      const categoryData = new CategoryCollection({
        category_name: category,
      });
      await categoryData.save();
      console.log("language", categoryData);
      if (categoryData) {
        return categoryData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = problemRepository;
