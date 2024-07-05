// file to add new problems
"use client";

// importing the required modules
import React, { useEffect, useState } from "react";
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import axios from "axios";
import dotenv from "dotenv";
import CategoryModal from "@/components/modal/CategoryModal";
import AddProblemIde from "@/components/IDE/AddProblemIde";

dotenv.config();

interface Category {
  _id: string;
  category_name: string;
}

const AddProblems = () => {
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  const [testCases, setTestCases] = useState<
    { testCase: string; expectedOutput: string }[]
  >([]);
  const [currentSection, setCurrentSection] = useState(1);

  const totalSections = 2;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement your submit logic here
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
                      placeholder="Enter course description"
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
                        htmlFor="problem_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Test Case
                      </label>
                      <input
                        type="text"
                        name="problem_name"
                        id="problem_name"
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                        placeholder="Enter the test case"
                      />
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="problem_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expected Output
                      </label>
                      <input
                        type="text"
                        name="problem_name"
                        id="problem_name"
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                        placeholder="Enter the expected output"
                      />
                    </div>
                    <AddProblemIde />
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
