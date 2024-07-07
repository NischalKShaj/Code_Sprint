const axios = require("axios");
const { Buffer } = require("buffer");

const verifyTestCase = async (sourceCode, inputTest, expectedOutput) => {
  const sourceCodeBase64 = Buffer.from(sourceCode).toString("base64");
  const inputTestBase64 = Buffer.from(inputTest).toString("base64");
  const expectedOutputBase64 = Buffer.from(expectedOutput).toString("base64");
  const payload = {
    source_code: sourceCodeBase64,
    language_id: 63,
    stdin: inputTestBase64,
    expected_output: expectedOutputBase64,
    base64_encoded: true,
  };

  try {
    const response = await axios.post(
      `http://localhost:2358/submissions?base64_encoded=false&wait=false`,
      payload
    );

    // Check if response.data contains the expected fields
    if (response.data) {
      const { status, message, stderr, stdout } = response.data;

      // Decode and log any message, stderr, or stdout
      if (message) {
        const decodedMessage = Buffer.from(message, "base64").toString("utf-8");
        console.log("Decoded Message:", decodedMessage);
      }
      if (stderr) {
        const decodedStderr = Buffer.from(stderr, "base64").toString("utf-8");
        console.log("Decoded Stderr:", decodedStderr);
      }
      if (stdout) {
        const decodedStdout = Buffer.from(stdout, "base64").toString("utf-8");
        console.log("Decoded Stdout:", decodedStdout);
      }

      // Check if status is 13 (Internal Error), throw an error
      if (status && status.id === 13) {
        throw new Error("Internal Error occurred");
      }
      return { success: true, data: response.data };
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error executing test case:", error);
    throw error; // Re-throw the error to ensure it's caught in the outer catch block
  }
};

// Example usage
const sourceCode = "console.log('Hello, World!');";
const inputTest = "";
const expectedOutput = "Hello, World!\n";

verifyTestCase(sourceCode, inputTest, expectedOutput)
  .then((result) => {
    if (result.success) {
      console.log("Test Case Result:", result);
    } else {
      console.error("Test Case Error:", result.data);
    }
  })
  .catch((error) => {
    console.error("Test Case Error:", error);
    process.exit(1); // Exit with a non-zero code to indicate failure
  });
