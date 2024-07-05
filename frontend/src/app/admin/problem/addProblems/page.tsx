"use client";

import React, { useEffect, useState } from "react";
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import axios from "axios";
import dotenv from "dotenv";
import LanguageModal from "@/components/modal/LanguageModal";
import CategoryModal from "@/components/modal/CategoryModal";

dotenv.config();

interface Language {
  _id: string;
  language: string;
}

interface Category {
  _id: string;
  category: string;
}

const AddProblems = () => {
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentSection, setCurrentSection] = useState(1);

  const totalSections = 4;

  // Fetch difficulty and language options
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problems/addProblems/languageAndDifficulty`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          console.log("resp", response.data.difficulty);
          setDifficulty(response.data.difficulty);
          setLanguage(response.data.language);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

  // Handle opening the language modal
  const handleAddLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // handle the opening of the category modal
  const handleAddCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCategoryModalOpen(true);
  };

  // Handle closing the language modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // handle closing the category modal
  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  // Handle saving language from modal
  const handleSaveLanguage = async (language: string, id: string) => {
    const token = localStorage.getItem("admin_access_token");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problems/addLanguage`,
        { language, id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 202) {
        setLanguage((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("error", error);
    }
    setIsModalOpen(false);
  };

  // Handle saving language from modal
  const handleSaveCategory = async (category: string) => {
    const token = localStorage.getItem("admin_access_token");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problems/addCategory`,
        { category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 202) {
        setCategory((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("error", error);
    }
    setIsCategoryModalOpen(false);
  };

  // Handle navigating to the next section
  const handleNextSection = () => {
    setCurrentSection((prevSection) =>
      Math.min(prevSection + 1, totalSections)
    );
  };

  // Handle navigating to the previous section
  const handlePreviousSection = () => {
    setCurrentSection((prevSection) => Math.max(prevSection - 1, 1));
  };

  // Calculate progress percentage
  const progressPercentage = ((currentSection - 1) / (totalSections - 1)) * 100;

  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form className="bg-white shadow-lg rounded-lg p-8 space-y-8 divide-y divide-gray-200">
            {/* Progress Bar */}
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
                      className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                      placeholder="Enter problem"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Language
                    </label>
                    <div className="flex items-center mt-3">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg flex-grow"
                      >
                        <option value="">Select a language</option>
                        {language.map((lang) => (
                          <option key={lang._id} value={lang._id}>
                            {lang.language}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddLanguage}
                        className="inline-flex items-center ml-3 px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        +
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
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                    >
                      <option value="">Select a difficulty</option>
                      {difficulty.map((diff, index) => (
                        <option key={index} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <div className="flex items-center mt-3">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg flex-grow"
                      >
                        <option value="">Select a category</option>
                        {language.map((lang) => (
                          <option key={lang._id} value={lang._id}>
                            {lang.language}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddCategory}
                        className="inline-flex items-center ml-3 px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleNextSection}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                    >
                      Next
                    </button>
                  </div>
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
                        Problem Name
                      </label>
                      <input
                        type="text"
                        name="problem_name"
                        id="problem_name"
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                        placeholder="Enter problem"
                      />
                    </div>
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
                        className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
                        placeholder="Enter problem"
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
                        type="button"
                        onClick={handleNextSection}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3 */}
            {currentSection === 3 && (
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Add Examples - Step 3
                </h2>
                <div className="mt-6">
                  {/* Add your inputs for section 3 here */}
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
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-blue-500 active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4 */}
            {currentSection === 4 && (
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Submit the Problem - Step 4
                </h2>
                <div className="mt-6">
                  {/* Add your inputs for section 4 here */}
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
      <LanguageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLanguage}
      />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AddProblems;
