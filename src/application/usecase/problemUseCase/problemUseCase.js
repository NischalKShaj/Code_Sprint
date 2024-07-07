// file to create the use case for the problem use case

// importing the required modules
const base64 = require("base-64");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
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
      language_id: 63,
      base64_encoded: true,
    };

    try {
      const response = await axios.post(
        `${process.env.JUDGE0}/submissions?base64_encoded=true&wait=false`,
        payload
      );

      const token = response.data.token;

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
        return { success: true, data: result };
      } else {
        // Other status: failed or error
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = problemUseCase;
