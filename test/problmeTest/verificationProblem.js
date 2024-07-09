const axios = require("axios");
const { Buffer } = require("buffer");

const jsCode = `
console.log("hello world");
`;

const payload = {
  source_code: Buffer.from(jsCode).toString("base64"),
  language_id: 63,
  number_of_runs: "1",
  stdin: "",
  expected_output: Buffer.from("hello world\n").toString("base64"),
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

axios
  .post(
    "http://localhost:2358/submissions?base64_encoded=true&wait=true",
    payload
  )
  .then((response) => {
    console.log("Submission Response:", response.data);
    if (response.data.stdout) {
      console.log(
        "Output:",
        Buffer.from(response.data.stdout, "base64").toString("utf-8")
      );
    }
    if (response.data.stderr) {
      console.log(
        "Error Output:",
        Buffer.from(response.data.stderr, "base64").toString("utf-8")
      );
    }
    if (response.data.compile_output) {
      console.log(
        "Compilation Error Output:",
        Buffer.from(response.data.compile_output, "base64").toString("utf-8")
      );
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
