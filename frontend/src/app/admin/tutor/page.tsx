// file to show the tutor details
"use client";

// importing all the required modules for the file
import { AppState } from "@/app/store";
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import React, { useEffect, useState } from "react";

const TutorPage = () => {
  const [loading, setLoading] = useState(true);
  const allTutors = AppState((state) => state.allTutor);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  // function to handle tutor block and unblock
  const handleBlock = async (id: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/tutor/${id}`
      );
      if (response.status === 200) {
        console.log("response", response.data);
        const status = response.data.status;
        const tutorIndex = allTutors.findIndex((tutor) => tutor.id === id);

        if (tutorIndex !== -1) {
          AppState.getState().blockUnblock(id, !status);
        }
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        {allTutors && allTutors.length > 0 ? (
          <div className="relative items-center justify-center overflow-x-auto top-1 shadow-md sm:rounded-lg">
            <table className="w-[950px] top-[100px] items-center justify-items-center ml-[400px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4"></th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>

                  {/* <th scope="col" className="px-6 py-3">
                  Position
                </th>*/}
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTutors.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4"></td>
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {user.username}
                        </div>
                        <div className="text-base font-thin">{user.email}</div>
                      </div>
                    </th>

                    {/* code for showing the online status of the user */}
                    {/* <td className="px-6 py-4">React Developer</td>*/}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                        Online
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.block ? (
                        <button
                          onClick={() => handleBlock(user.id)}
                          className="font-bold py-2 px-4 rounded-xl absolute bg-green-600 text-white"
                        >
                          unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(user.id)}
                          className="font-bold py-2 px-4 rounded-xl absolute bg-red-600 text-white"
                        >
                          block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No user found</p>
        )}
      </SpinnerWrapper>
    </div>
  );
};

export default TutorPage;
