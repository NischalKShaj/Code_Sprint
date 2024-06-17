// file to implement the editing of the student details
"use client";

// importing the required modules
import { AppState } from "@/app/store";
import UserSideBar from "@/components/partials/UserSideBar";
import React, { useState } from "react";

const StudentId = () => {
  const user = AppState((state) => state.user);
  const [formData, setFormData] = useState({
    username: user?.username || " ",
    email: user?.email || " ",
    role: user?.role || "student",
    // phone:user?.phone||""
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <UserSideBar />
      <div className="flex flex-col items-center mb-24 bg-white mt-16">
        <h3 className="text-2xl font-bold mb-6 text-center items-center">
          Edit your details
        </h3>
        {/* {message && <p className="text-red-500 mt-4">{message}</p>} */}
        <section className="bg-[#D9D9D9] p-8 w-[370px] rounded-lg shadow-md">
          <form>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
              required
            />
            {/* {errors.username && (
              <p className="text-red-500 mt-1">{errors.username}</p>
            )} */}
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
              required
            />
            <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 w-full mt-3">
              <div className="flex items-center mb-4">
                <span className="mr-2">Role:</span>
                <span className="font-bold">
                  {formData.role.charAt(0).toUpperCase() +
                    formData.role.slice(1)}
                </span>
              </div>
            </div>
            {/* <input
              type="text"
              id="phone"
              name="phone"
              placeholder="phone"
              value
              //   onChange={handleSignup}
              required
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
            /> */}
            {/* {errors.phone && (
              <p className="text-red-500 mt-1">{errors.phone}</p>
            )} */}
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
              required
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
            />
            {/* {errors.password && (
              <p className="text-red-500 mt-1">{errors.password}</p>
            )} */}
            <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-full mt-7">
              signup
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default StudentId;
