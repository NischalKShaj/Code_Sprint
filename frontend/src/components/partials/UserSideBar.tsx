// side bar that is shown in the user and tutors profile
"use client";

// importing the required modules
import { AppState } from "@/app/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserSideBar = () => {
  const user = AppState((state) => state.user);
  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="absolute top-[250px] left-[50px] z-40 w-72  transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className=" px-3 py-4 rounded-lg items-center justify-center overflow-y-auto bg-[#D9D9D9] dark:bg-gray-800">
          <ul className="space-y-2 font-medium flex flex-col items-center">
            <li>
              <div className="relative">
                <Image
                  className="w-100 h-100 rounded-full ring-4 dark:ring-gray-800 mt-[10px]"
                  width={100}
                  height={100}
                  src={user?.profileImage || ""}
                  alt="profile image"
                />
                <span className="bottom-0 left-16 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
            </li>
            <li className="flex flex-col items-start mt-[10px]">
              <div className="relative mt-[10px] flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 10a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-6 2-6 4v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1c0-2-2-4-6-4z" />
                </svg>
                <h3>{user?.username}</h3>
              </div>
              <div className="relative mt-[10px] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 5.08V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.08M12 10l10-7H2l10 7zm0 0l-10 7a2 2 0 0 0 2.18 0L12 10z" />
                </svg>
                <p>{user?.email}</p>
              </div>

              <div className="relative mt-[10px] flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <p>{user?.role}</p>
              </div>
              <div className="relative mt-[10px] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 0 0-8 8v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a8 8 0 0 0-8-8zm-1 13a1 1 0 0 1-2 0V13a1 1 0 0 1 2 0v2zm4 0a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0v2zm1-5a7 7 0 0 1-14 0V7a5 5 0 0 1 10 0v3zm-2-1V7a3 3 0 0 0-6 0v2h6z"
                    clipRule="evenodd"
                  />
                </svg>
                <Link
                  href="/usr/chat"
                  className="text-gray-500 hover:text-gray-700 ml-2" // Adjust margin left (ml) for spacing
                >
                  Chat
                </Link>
              </div>
            </li>
            <li className="mt-">
              <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 mb-[20px] rounded md:my-10 dark:bg-gray-700" />
            </li>
            <li>
              <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl mb-[100px]">
                Edit Profile
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default UserSideBar;
