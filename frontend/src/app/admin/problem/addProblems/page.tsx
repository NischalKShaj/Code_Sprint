// file to add new problems
"use client";

// importing the required modules
import React, { ChangeEventHandler, useEffect, useState } from "react";
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import axios from "axios";
import dotenv from "dotenv";
import CategoryModal from "@/components/modal/CategoryModal";
import Editor from "@monaco-editor/react";
import AddProblemIde from "@/components/IDE/AddProblemIde";
import Swal from "sweetalert2";

dotenv.config();

interface Category {
  _id: string;
  category_name: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface FormData {
  problemName: string;
  description: string;
  category: string;
  difficulty: string;
  testCase: TestCase[];
  mainCode: string;
  clientTemplate: string;
  constraints: string;
}

const AddProblems = () => {
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  const [inputTestCase, setInputTestCase] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentSection, setCurrentSection] = useState(1);
  const [sourceCode, setSourceCode] = useState('console.log("Hello World");');
  const [clientSourceCode, setClientSourceCode] = useState(
    'console.log("Hello World");'
  );
  const [constraints, setConstraints] = useState("");
  const [formData, setFormData] = useState<FormData>({
    problemName: "",
    description: "",
    difficulty: "",
    category: "",
    testCase: [],
    mainCode: "",
    clientTemplate: "",
    constraints: "",
  });

  const totalSections = 3;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problems/addProblems/categoryAndDifficulty`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          setDifficulty(response.data.difficulty);
          setCategory(response.data.category);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

  const handleAddCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  // function to save the category
  const handleSaveCategory = async (categoryName: string) => {
    const token = localStorage.getItem("admin_access_token");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problems/addCategory`,
        { category: categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 202) {
        setCategory((prev) => [...prev, response.data]);
        setSelectedCategory(response.data.category_name); // Set the newly added category as selected
      }
    } catch (error) {
      console.error("error", error);
    }
    setIsCategoryModalOpen(false);
  };

  const handleNextSection = () => {
    setCurrentSection((prevSection) =>
      Math.min(prevSection + 1, totalSections)
    );
  };

  const handlePreviousSection = () => {
    setCurrentSection((prevSection) => Math.max(prevSection - 1, 1));
  };

  const progressPercentage = ((currentSection - 1) / (totalSections - 1)) * 100;

  // function to add the test cases to the state
  const handleTestCase: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputTestCase(e.currentTarget.value);
  };

  const handleExpectedOutput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setExpectedOutput(e.currentTarget.value);
  };

  const handleSourceCodeChange = (value: string | undefined) => {
    if (value) setSourceCode(value);
  };

  const addTestCase = () => {
    if (inputTestCase && expectedOutput) {
      setInputTestCase("");
      setExpectedOutput("");
      setTestCases([...testCases, { input: inputTestCase, expectedOutput }]);
    }
  };

  // function to handle the verification of the testCases
  const verifyTestCase = async () => {
    const token = localStorage.getItem("admin_access_token");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/addProblem/verifyTestCase`,
        { sourceCode, testInput: inputTestCase, expectedOutput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 202) {
        const decodedOutput = response.data.decodedOutput;
        console.log("response", response.data.decodedOutput);
        if (parseInt(decodedOutput) === parseInt(expectedOutput)) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Test case verified",
            confirmButtonText: "Ok",
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Test case not verified",
            text: `Expected output is ${response.data.decodedOutput}`,
            confirmButtonText: "Ok",
          });
        }
      } else if (response.status === 404) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Test case not verified",
          text: `Expected output is ${response.data.decodedOutput}`,
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("error", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Test case not verified",
        // text: `Expected output is ${response.data.decodedOutput}`,
        confirmButtonText: "Ok",
      });
    }
  };

  // function to handle the client side template
  const handleClientSourceCodeChange = (value: string | undefined) => {
    if (value) setClientSourceCode(value);
  };

  // function to handle the constraints
  const handleConstraintChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setConstraints(e.currentTarget.value);
  };

  // function to add the question
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("admin_access_token");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problem/addProblem`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {}
  };

  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            className="bg-white shadow-lg rounded-lg p-8 space-y-8 divide-y divide-gray-200"
            onSubmit={handleSubmit}
          >
            {/* Progress bar */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                ></div>
              </div>
            </div>

            {/* Section 1 */}
            {currentSection === 1 && (
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Add problems - Step 1
                </h2>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <div className="col-span-1">
                    <label
                      htmlFor="problem_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Problem Name
                    </label>
                    <input
                      type="text"
                      name="problem_name"
                      id="problem_name"
                      value={problemName}
                      onChange={(e) => setProblemName(e.target.value)}
                      className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                      placeholder="Enter problem"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <div className="flex items-center">
                      <select
                        id="category"
                        name="category"
                        autoComplete="category-name"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        {category.map((cat) => (
                          <option key={cat._id} value={cat.category_name}>
                            {cat.category_name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                      placeholder="Enter problem description"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="difficulty"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Difficulty
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      autoComplete="difficulty-name"
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                    >
                      <option value="" disabled>
                        Select Difficulty
                      </option>
                      {difficulty.map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextSection}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Section 2 */}
            {currentSection === 2 && (
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Add Test Cases - Step 2
                </h2>
                <div className="mt-6">
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                    <div className="col-span-1">
                      <label
                        htmlFor="test_input"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Test Case
                      </label>
                      <input
                        type="text"
                        name="test_input"
                        value={inputTestCase}
                        onChange={handleTestCase}
                        id="test_input"
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                        placeholder="Enter the test case"
                      />
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="expected_output"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expected Output
                      </label>
                      <input
                        type="text"
                        name="expected_output"
                        value={expectedOutput}
                        onChange={handleExpectedOutput}
                        id="expected_output"
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                        placeholder="Enter the expected output"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex justify-end space-x-4">
                      <button
                        onClick={addTestCase}
                        className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                    {testCases.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Saved Test Cases
                        </h3>
                        {testCases.map((testCase, index) => (
                          <div
                            key={index}
                            className="mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg"
                          >
                            <p>
                              <strong>Test Case {index + 1}:</strong>{" "}
                              {testCase.input}
                            </p>
                            <p>
                              <strong>Expected Output:</strong>{" "}
                              {testCase.expectedOutput}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="col-span-1 sm:col-span-2 mt-6">
                      <label
                        htmlFor="source_code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Source Code
                      </label>
                      <div className="w-full max-w-4xl p-4 border">
                        <Editor
                          height="50vh"
                          defaultLanguage="javascript"
                          value={sourceCode}
                          onChange={handleSourceCodeChange}
                          theme="vs-dark"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex justify-end space-x-4">
                      <button
                        onClick={verifyTestCase}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                      >
                        Verify Test
                      </button>
                    </div>
                  </div>
                  <div className="pt-5">
                    <div className="flex justify-between space-x-4">
                      <button
                        type="button"
                        onClick={handlePreviousSection}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSection}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentSection === 3 && (
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Add Constraints - Step 3
                </h2>
                <div className="col-span-1 sm:col-span-2 mt-6">
                  <label
                    htmlFor="source_code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Client side template
                  </label>
                  <div className="w-full max-w-4xl p-4 border">
                    <Editor
                      height="50vh"
                      defaultLanguage="javascript"
                      value={clientSourceCode}
                      onChange={handleClientSourceCodeChange}
                      theme="vs-dark"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                    <div className="col-span-1">
                      <label
                        htmlFor="problem_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Constraint
                      </label>
                      <input
                        type="text"
                        name="constraint"
                        id="constraint"
                        value={constraints}
                        onChange={handleConstraintChange}
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                        placeholder="Enter the constraints"
                      />
                    </div>
                  </div>
                  <div className="pt-5">
                    <div className="flex justify-between space-x-4">
                      <button
                        type="button"
                        onClick={handlePreviousSection}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </SpinnerWrapper>
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AddProblems;
