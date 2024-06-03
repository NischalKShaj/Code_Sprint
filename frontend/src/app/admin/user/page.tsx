// file for showing user name
"use client";

// importing all the required files
import React, { useEffect, useState } from "react";
import { AppState } from "@/app/store";
import dynamic from "next/dynamic";
const AdminSidePanel = dynamic(
  () => import("@/components/partials/AdminSidePanel"),
  { ssr: false }
);

const UserPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const allUser = AppState((state) => state.allUser);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // make it a skeleton
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminSidePanel />

      {allUser && allUser.length > 0 ? (
        <div className="relative items-center justify-center overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-[950px] top-[100px] items-center justify-items-center ml-[400px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4"></th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Position
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allUser.map((user) => (
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
                      <div className="font-normal text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">React Developer</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                      Online
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit user
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default UserPage;
