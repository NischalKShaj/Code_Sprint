// file to create the repository for the problems

// importing the required modules
const ProblemCollection = require("../../../core/entities/problems/problemCollection");
const LanguageCollection = require("../../../core/entities/languages/languageCollection");
const CategoryCollection = require("../../../core/entities/problemCategory/problemCategory");
const TestCaseCollection = require("../../../core/entities/testCases/testCases");

// helper function to get the difficulty
const getDifficulty = (schema, path) => {
  const enumValues = schema.path(path).enumValues;
  return enumValues;
};

// creating the problems repository
const problemRepository = {
  // method for getting the category and the difficulty for the question
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

  // method for adding new category
  addCategory: async (category) => {
    try {
      const categoryData = new CategoryCollection({
        category_name: category,
      });
      await categoryData.save();
      console.log("category", categoryData);
      if (categoryData) {
        return categoryData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for adding new problem
  addProblem: async (
    data,
    mainCode,
    clientCode,
    testCases,
    exampleTestCase
  ) => {
    try {
      console.log("first", data);
      const problemData = new ProblemCollection({
        title: data.problemName,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        mainCode: mainCode,
        clientCode: clientCode,
      });

      await problemData.save();

      const testCase = new TestCaseCollection({
        problemId: problemData._id,
        testCases: testCases,
        exampleTest: exampleTestCase,
      });

      await testCase.save();

      const problem = await ProblemCollection.findByIdAndUpdate(
        { _id: problemData._id },
        { testCase: testCase },
        { new: true }
      );

      if (problem) {
        return problem;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = problemRepository;
