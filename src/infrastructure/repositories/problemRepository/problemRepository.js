// file to create the repository for the problems

// importing the required modules
const ProblemCollection = require("../../../core/entities/problems/problemCollection");
const CategoryCollection = require("../../../core/entities/problemCategory/problemCategory");
const TestCaseCollection = require("../../../core/entities/testCases/testCases");
const DailyProblemCollection = require("../../../core/entities/dailyProblem/dailyProblem");
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
      console.log("Received data:", data);
      console.log("Main code:", mainCode);
      console.log("Client code:", clientCode);
      console.log("Test cases:", testCases);
      console.log("Example test cases:", exampleTestCase);

      const problemData = new ProblemCollection({
        title: data.problemName,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        constraints: data.constraints,
        mainCode: mainCode,
        clientCode: clientCode,
      });

      let savedProblem = await problemData.save();
      console.log("Saved problem:", savedProblem);

      const testCaseData = new TestCaseCollection({
        problemId: savedProblem._id,
        testCases: testCases,
        exampleTest: exampleTestCase,
      });

      let savedTestCase = await testCaseData.save();
      console.log("Saved test cases:", savedTestCase);

      const updatedProblem = await ProblemCollection.findByIdAndUpdate(
        savedProblem._id,
        { testCase: savedTestCase._id },
        { new: true }
      );

      console.log("Updated problem with test cases:", updatedProblem);

      if (updatedProblem) {
        return updatedProblem;
      } else {
        throw new Error("Failed to update problem with test cases");
      }
    } catch (error) {
      console.error("Error adding problem:", error);
      throw error;
    }
  },

  // method to show all the problems
  showProblems: async () => {
    try {
      const problems = await ProblemCollection.find(
        {},
        { title: 1, category: 1, difficulty: 1, description: 1, premium: 1 }
      );
      if (problems) {
        return problems;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method to show the specific program
  showProblem: async (id) => {
    try {
      const problem = await ProblemCollection.findById({ _id: id });
      const testCases = await TestCaseCollection.findOne(
        { problemId: id },
        { exampleTest: 1, testCases: 1 }
      );
      if (problem && testCases) {
        return { problem, testCases };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method to check the test case
  checkTestCase: async (id) => {
    try {
      const mainCode = await ProblemCollection.findById(
        { _id: id },
        { mainCode: 1, _id: 0 }
      );
      const exampleTestCase = await TestCaseCollection.findOne(
        { problemId: id },
        { exampleTest: 1, _id: 0 }
      );
      if (mainCode && exampleTestCase) {
        return { mainCode, exampleTestCase };
      }
    } catch (error) {
      throw error;
    }
  },

  // method to make the submission of the code
  problemSubmission: async (id) => {
    try {
      const mainCode = await ProblemCollection.findById(
        { _id: id },
        { mainCode: 1, _id: 0 }
      );

      const testCases = await TestCaseCollection.findOne(
        { problemId: id },
        { testCases: 1, _id: 0 }
      );

      const dailyChallenge = await DailyProblemCollection.findOne({
        problemId: id,
      });

      console.log("dailyC", dailyChallenge);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to midnight

      let dailyChallengeData = null;

      if (dailyChallenge) {
        const challengeDate = new Date(dailyChallenge.date);
        challengeDate.setHours(0, 0, 0, 0); // Reset time to midnight

        // Compare only the date part
        if (today.getTime() === challengeDate.getTime()) {
          dailyChallengeData = dailyChallenge;
        }
      }

      console.log("dailyChallengeData", dailyChallengeData);

      console.log("dailyChallengeData", dailyChallengeData);

      if (mainCode && testCases) {
        return { mainCode, testCases, dailyChallengeData };
      }
    } catch (error) {
      throw error;
    }
  },

  // method for generating the daily problem and storing in the database
  dailyProblem: async (id) => {
    try {
      const todaysProblem = new DailyProblemCollection({
        problemId: id,
        date: Date.now(),
      });
      const savedProblem = await todaysProblem.save();
      return savedProblem;
    } catch (error) {
      throw error;
    }
  },

  // method for getting the daily problems
  getDailyProblems: async () => {
    try {
      const dailyProblems = await DailyProblemCollection.find();

      console.log("dailyProblems", dailyProblems);

      const problemsIds = dailyProblems.map((id) => id.problemId);

      console.log("problemsIds", problemsIds);

      const problems = await ProblemCollection.find(
        { _id: { $in: problemsIds } },
        { title: 1, category: 1, difficulty: 1 }
      );

      console.log("problems", problems);

      // Create a map of problems by their IDs
      const problemMap = problems.reduce((map, problem) => {
        map[problem._id] = problem;
        return map;
      }, {});

      console.log("problemMap", problemMap);

      // Combine the daily problems with their respective details from the problem collection
      const result = dailyProblems.map((dp) => ({
        date: dp.date,
        problem: problemMap[dp.problemId] || {},
      }));

      console.log("result", result);

      if (result.length > 0) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for getting the daily coding challenge
  dailyChallenge: async (date) => {
    try {
      const passedDate = new Date(date);

      passedDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(passedDate);
      nextDay.setDate(passedDate.getDate() + 1);

      // extracting the id of the particular problem according to the date
      const problemId = await DailyProblemCollection.findOne(
        {
          date: { $gte: passedDate, $lt: nextDay },
        },
        { problemId: 1 }
      );
      console.log("problemId", problemId);

      // extracting the problem and sending it to the frontend
      const problem = await ProblemCollection.findById({
        _id: problemId.problemId,
      });

      // extracting the test cases
      const testCases = await TestCaseCollection.findOne(
        { problemId: problemId.problemId },
        { exampleTest: 1, testCases: 1 }
      );

      console.log("problem", problem);
      if (problem && testCases) {
        return { problem, testCases };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = problemRepository;
