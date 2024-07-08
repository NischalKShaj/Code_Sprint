const axios = require("axios");
const { Buffer } = require("buffer");

// Your Java code
const javaCode = `
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askForInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function calculateSum(array) {
  let sum = 0;
  for (let num of array) {
    sum += num;
  }
  return sum;
}

async function main() {
  try {
    const inputString = await askForInput('');
    const stringArray = inputString.split(' ');
    const intArray = stringArray.map(str => {
      if (str.trim() !== '') {
        return parseInt(str);
      } else {
        return 0;
      }
    });
    const sum = calculateSum(intArray);
    console.log(sum); // Ensure the sum is logged
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
`;

// Base64 encode the Java code
const sourceCodeBase64 = Buffer.from(javaCode).toString("base64");

const verifyTestCase = async (inputTest, expectedOutput) => {
  const inputTestBase64 = Buffer.from(inputTest).toString("base64");
  const expectedOutputBase64 = Buffer.from(expectedOutput).toString("base64");
  const payload = {
    source_code: sourceCodeBase64,
    language_id: 63, // Java
    stdin: inputTestBase64,
    expected_output: expectedOutputBase64,
    base64_encoded: true,
  };

  try {
    const response = await axios.post(
      `http://localhost:2358/submissions?base64_encoded=true&wait=true`,
      payload
    );

    console.log(response.data);

    if (response.data) {
      const { status, message, stderr, stdout } = response.data;

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

      if (status && status.id === 13) {
        throw new Error("Internal Error occurred");
      }
      return { success: true, data: response.data };
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error executing test case:", error);
    throw error;
  }
};

// Example usage
const inputTest = "1 2 3 4 5";
const expectedOutput = "15\n";

verifyTestCase(inputTest, expectedOutput)
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
