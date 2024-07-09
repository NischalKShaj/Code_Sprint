const axios = require("axios");
const { Buffer } = require("buffer");

// Your corrected JavaScript code
const jsCode = `
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (answer) => {
  console.log(answer);
  rl.close();
});
`;

// Base64 encode the corrected JavaScript code
const sourceCodeBase64 = Buffer.from(jsCode).toString("base64");

const verifyTestCase = async () => {
  const payload = {
    source_code: sourceCodeBase64,
    language_id: 63, // JavaScript language ID
    number_of_runs: 1,
    stdin: Buffer.from("hello").toString("base64"), // Base64 encode input "hello"
    expected_output: Buffer.from("hello").toString("base64"), // Base64 encode expected output "hello"
    base64_encoded: true,
    cpu_time_limit: "10", // Increase CPU time limit if necessary
    cpu_extra_time: "1", // Increase extra CPU time if necessary
    wall_time_limit: "15", // Increase wall time limit if necessary
    memory_limit: "128000",
    stack_limit: "64000",
    max_processes_and_or_threads: "60",
    enable_per_process_and_thread_time_limit: true,
    enable_per_process_and_thread_memory_limit: true,
    max_file_size: "1024",
    enable_network: true,
  };

  try {
    const response = await axios.post(
      `http://localhost:2358/submissions?base64_encoded=true&wait=true`,
      payload
    );

    console.log(response.data);

    if (response.data) {
      const { status, message, stderr, stdout, compile_output } = response.data;

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
      if (compile_output) {
        const decodedCompileOutput = Buffer.from(
          compile_output,
          "base64"
        ).toString("utf-8");
        console.log("Decoded Compile Output:", decodedCompileOutput);
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
verifyTestCase()
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
