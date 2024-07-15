// file to execute the code and pass to the judge0 compiler

// importing the required modules
const axios = require("axios");
const base64 = require("base-64");
const dotenv = require("dotenv");
dotenv.config();

// function to process the test cases
const processTestCases = async (testCases, sourceCode) => {
  let allPassed = true;
  let results = [];

  try {
    for (const testCase of testCases) {
      const { input, expectedOutput } = testCase;
      const verify = await verifyTestCase(input, expectedOutput, sourceCode);

      results.push(verify);

      if (
        !verify.success ||
        (verify.data.statusId !== 3 && verify.data.statusId !== 4)
      ) {
        allPassed = false;
        break;
      }

      if (verify.data.statusId === 4) {
        allPassed = false;
        break;
      }
    }

    return { allPassed, results };
  } catch (error) {
    console.error("error", error);
    return {
      allPassed: false,
      results: [{ success: false, data: error.message }],
    };
  }
};

// function for checking the test case
const verifyTestCase = async (input, output, sourceCode) => {
  try {
    const encodedInputTest = base64.encode(input);
    const encodedOutput = base64.encode(output);

    // Payload for the Judge0 server
    const payload = {
      source_code: sourceCode,
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
        const decodedOutput = base64.decode(result.stdout);
        return {
          success: true,
          data: { ...result, decodedOutput, statusId: result.status.id },
        };
      } else if (result.status.id === 4) {
        const decodedOutput = base64.decode(result.stdout);
        return {
          success: true,
          data: {
            ...result,
            input,
            decodedOutput,
            expectedOutput: output,
            statusId: result.status.id,
          },
        };
      } else {
        return {
          success: false,
          data: { ...result, statusId: result.status.id },
        };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  } catch (error) {
    console.error("error", error);
  }
};

module.exports = processTestCases;
