// file to create the use case for the problem use case

// importing the required modules
const base64 = require("base-64");
const axios = require("axios");
const dotenv = require("dotenv");
const moment = require("moment-timezone");
const problemService = require("../../../infrastructure/services/codeService");
const problemRepository = require("../../../infrastructure/repositories/problemRepository/problemRepository");
const userRepository = require("../../../infrastructure/repositories/userRepository/userRepository");
dotenv.config();

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

  // use case for verifying the source code provided
  verifyTestCase: async (sourceCode, inputTest, expectedOutput) => {
    const encodedSourceCode = base64.encode(sourceCode);
    const encodedInputTest = base64.encode(inputTest);
    const encodedOutput = base64.encode(expectedOutput);

    // Log encoded values for debugging
    console.log(`Source Code: ${sourceCode} | Encoded: ${encodedSourceCode}`);
    console.log(`Input: ${inputTest} | Encoded: ${encodedInputTest}`);
    console.log(`Output: ${expectedOutput} | Encoded: ${encodedOutput}`);

    // Payload for the Judge0 server
    const payload = {
      source_code: encodedSourceCode,
      stdin: encodedInputTest,
      expected_output: encodedOutput,
      language_id: 71,
      base64_encoded: true,
      cpu_time_limit: "15",
      cpu_extra_time: "5",
      wall_time_limit: "10",
      memory_limit: "128000",
      stack_limit: "64000",
      max_processes_and_or_threads: "60",
      enable_per_process_and_thread_time_limit: true,
      enable_per_process_and_thread_memory_limit: true,
      max_file_size: "1024",
      enable_network: true,
      base64_encoded: true,
    };

    try {
      const response = await axios.post(
        `${process.env.JUDGE0}/submissions?base64_encoded=true&wait=true`,
        payload
      );

      const token = response.data.token;

      console.log("response", response.data);

      // Polling the submission status
      let statusResponse;
      let isCompleted = false;

      while (!isCompleted) {
        statusResponse = await axios.get(
          `${process.env.JUDGE0}/submissions/${token}?base64_encoded=true`
        );
        const status = statusResponse.data.status;

        if (status.id === 1 || status.id === 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        } else {
          isCompleted = true;
        }
      }

      // Check the result
      const result = statusResponse.data;
      console.log(result);

      if (result.status.id === 3) {
        // Status 3: Accepted
        const decodedOutput = base64.decode(result.stdout);
        return { success: true, data: { ...result, decodedOutput } };
      } else if (result.status.id === 4) {
        const decodedOutput = base64.decode(result.stdout);
        return { success: true, data: { ...result, decodedOutput } };
      } else {
        // Other status: failed or error
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // controller for adding the problem
  addProblem: async (data) => {
    try {
      // encoding the main code and the client template
      const mainCode = base64.encode(data.mainCode);
      const clientCode = base64.encode(data.clientTemplate);
      const testCases = data.testCase;
      const exampleTestCase = data.testCase.slice(0, 3);

      const response = await problemRepository.addProblem(
        data,
        mainCode,
        clientCode,
        testCases,
        exampleTestCase
      );

      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // use case for showing all the problems
  showProblems: async () => {
    try {
      const result = await problemRepository.showProblems();
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // use case for showing specific problem
  showProblem: async (id) => {
    try {
      const result = await problemRepository.showProblem(id);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // use case for checking the test cases
  checkTestCase: async (id, clientCode) => {
    try {
      const { mainCode, exampleTestCase } =
        await problemRepository.checkTestCase(id);

      console.log("main", exampleTestCase);

      const decodedMain = base64.decode(mainCode.mainCode);
      // combining the source code
      const code = clientCode + "\n" + decodedMain;

      const sourceCode = base64.encode(code); //encoding the entire code for testing

      // passing the test inputs and the source code to the services
      const { allPassed, results } = await problemService(
        exampleTestCase.exampleTest,
        sourceCode
      );

      console.log("verify", results);

      if (allPassed) {
        return { success: true, data: results };
      } else {
        return { success: false, data: results };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for submitting code
  problemSubmission: async (id, clientCode, userId) => {
    try {
      const { mainCode, testCases, dailyChallengeData } =
        await problemRepository.problemSubmission(id);

      const decodedMain = base64.decode(mainCode.mainCode);

      // combining the client code and the main code
      const code = clientCode + "\n" + decodedMain;

      const sourceCode = base64.encode(code);

      // passing the test inputs and the source code to the services
      const { allPassed, results } = await problemService(
        testCases.testCases,
        sourceCode
      );

      if (allPassed) {
        // if all the test cases are passed then the problem is added to the user collection
        let user;
        if (dailyChallengeData) {
          user = await userRepository.addProblem(
            id,
            userId,
            dailyChallengeData
          );
        } else {
          user = await userRepository.addProblem(id, userId);
        }
        if (user) {
          return { success: true, data: results };
        }
      } else {
        return { success: false, data: results };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for getting all problems and randomly generate the problem for the daily problem
  dailyProblem: async () => {
    try {
      const allProblems = await problemRepository.showProblems();
      if (allProblems) {
        const randomIndex = Math.floor(Math.random() * allProblems.length);
        console.log("Random index:", randomIndex);

        const todaysProblem = allProblems[randomIndex]._id;
        console.log("Today's problem ID:", todaysProblem);
        const now = moment().tz("Asia/Kolkata");
        const dailyProblem = await problemRepository.dailyProblem(
          todaysProblem,
          now
        );
        return dailyProblem;
      }
    } catch (error) {
      console.error("object", error);
      return error;
    }
  },

  // use case for getting all the daily problems
  getDailyProblems: async () => {
    try {
      const result = await problemRepository.getDailyProblems();
      console.log("result in use case", result);
      if (result) {
        console.log("here");
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // use case for getting the daily coding problems
  dailyChallenge: async (date) => {
    try {
      const result = await problemRepository.dailyChallenge(date);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = problemUseCase;
