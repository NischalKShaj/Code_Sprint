// file to show the daily problems
"use client";

// importing the required module
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect } from "react";
import dotenv from "dotenv";
dotenv.config();

const DailyProblem = () => {
  // initial loading to get the daily problems
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problem/dailyProblems`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          console.log("response", response.data);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  });
  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <div className="flex-1 ml-[220px] flex justify-center mt-[25px]">
          {/* {currentProblems && currentProblems.length > 0 ? ( */}
          <div className="relative items-center justify-center overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-[1000px] items-center justify-items-center text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3"
                    style={{ width: "200px" }}
                  >
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {currentProblems.map((problem) => ( */}
                <tr
                  // key={problem._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "300px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {/* {problem.title} */}
                  </td>
                  <td className="px-6 py-4">{/* {problem.description}  */}</td>
                  <td
                    className={`px-6 py-4 `}
                    //   ${
                    //   problem.difficulty === "Easy"
                    //     ? "text-green-500"
                    //     : problem.difficulty === "Medium"
                    //     ? "text-yellow-500"
                    //     : problem.difficulty === "Hard"
                    //     ? "text-red-500"
                    //     : ""
                    // }
                    // `}
                  >
                    {/* {problem.difficulty} */}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {/* {problem.category} */}
                  </td>
                  <td className="px-6 py-4 space-x-2 justify-center">
                    <FontAwesomeIcon
                      icon={faUnlock}
                      style={
                        {
                          // color: problem.premium ? "goldenrod" : "black",
                        }
                      }
                    />
                  </td>
                </tr>
                {/* ))} */}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button
                // onClick={prevPage}
                className={`px-4 py-2 mx-1 rounded`}
                //    ${
                //   // currentPage === 1
                //     // ? "bg-gray-300 cursor-not-allowed"
                //     // : "bg-blue-500 text-white"
                // } `}
                // disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                // onClick={nextPage}
                className={`px-4 py-2 mx-1 rounded`}
                //   ${
                //   currentPage === Math.ceil(problems.length / itemsPerPage)
                //     ? "bg-gray-300 cursor-not-allowed"
                //     : "bg-blue-500 text-white"
                // }`}
                // disabled={
                //   currentPage === Math.ceil(problems.length / itemsPerPage)
                // }
              >
                Next
              </button>
            </div>
          </div>
          {/* ) : ( */}
          <p>No problems found</p>
          {/* )} */}
        </div>
      </SpinnerWrapper>
    </div>
  );
};

export default DailyProblem;
