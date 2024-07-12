// page to show each problems
"use client";

// importing required modules
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import dotenv from "dotenv";
import { ProblemState } from "@/app/store/problemStore";
import { Editor } from "@monaco-editor/react";
import base64 from "base-64";
dotenv.config();

const ProblemId = () => {
  const { problemId } = useParams() as { problemId: string };
  const showProblem = ProblemState((state) => state.showProblem);
  const problem = ProblemState((state) => state.problem);
  const router = useRouter();

  // fetching the data for the question
  useEffect(() => {
    const fetchData = async (id: string) => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/problems/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          console.log("response", response.data);
          const decodedClientCode = base64.decode(
            response.data.problem.clientCode
          );
          showProblem({
            _id: response.data.problem._id,
            title: response.data.problem.title,
            description: response.data.problem.description,
            difficulty: response.data.problem.difficulty,
            category: response.data.problem.category,
            testCases: response.data.testCases.testCases,
            exampleTestCase: response.data.testCases.exampleTest,
            constraints: "Integer is between 1-1000",
            premium: response.data.testCases.premium,
            clientCode: decodedClientCode,
          });
        }
      } catch (error) {
        console.error("error", error);
        router.push("/error");
      }
    };
    if (problemId) {
      fetchData(problemId);
    }
  }, [problemId, router, showProblem]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 p-4 rounded-md">
        <h1 className="text-2xl font-bold text-green-400">{problem?.title}</h1>
        <p className="text-white mt-2">{problem?.description}</p>
        <p className="mt-2">
          <strong className="text-white">Difficulty:</strong>{" "}
          <span
            className={
              problem?.difficulty === "Easy"
                ? "text-green-500"
                : problem?.difficulty === "Medium"
                ? "text-yellow-500"
                : problem?.difficulty === "Hard"
                ? "text-red-500"
                : ""
            }
          >
            {problem?.difficulty}
          </span>
        </p>
        <p className="text-white mt-2">
          <strong>Category:</strong> {problem?.category}
        </p>
        <p className="text-white mt-2">
          <strong>Constraints:</strong> {problem?.constraints}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label
              htmlFor="source_code"
              className="block text-green-600 text-sm font-medium"
            >
              Code {"</>"} <span className="text-white"> python</span>
            </label>
            <div className="w-full p-4 border">
              <Editor
                height="50vh"
                defaultLanguage="python"
                value={problem?.clientCode}
                theme="vs-dark"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="example_test_case"
              className="block text-green-600  text-sm font-medium"
            >
              Example Test Case
            </label>
            <div className="w-full p-4 border bg-gray-700 text-white">
              {problem?.exampleTestCase?.map((test: any, index) => (
                <div key={index} className="mb-4">
                  <p>
                    <strong>Input:</strong> {test.input}
                  </p>
                  <p>
                    <strong>Output:</strong> {test.expectedOutput}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemId;
