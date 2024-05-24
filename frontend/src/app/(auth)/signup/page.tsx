// page for user and tutor signup
"use client";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import React, { ChangeEventHandler, useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({});

  // function to handle the changing elements in the form
  const handleSignup: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    setFormData({ ...formData, [target.id]: target.value });
  };

  // function to handle the signup of the user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("base url", process.env.NEXT_PUBLIC_BASE_URL);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/signup`
      );
      console.log(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-24 bg-white mt-16">
      <h3 className="text-2xl font-bold mb-6 text-center items-center">
        Learn with Passion. Connect with Experts.
        <br /> Sign up today!
      </h3>
      <section className="bg-[#D9D9D9] p-8 h-[530px] w-[370px] rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            onChange={handleSignup}
            placeholder="username"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            required
          />
          <input
            type="email"
            id="email"
            onChange={handleSignup}
            placeholder="email"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            required
          />
          <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 w-full mt-3">
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="student"
                onChange={handleSignup}
                name="role"
                value="student"
              />
              <label htmlFor="student">Student</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="tutor"
                name="role"
                onChange={handleSignup}
                value="tutor"
              />
              <label htmlFor="tutor">Tutor</label>
            </div>
          </div>
          <input
            type="text"
            id="phone"
            placeholder="phone"
            onChange={handleSignup}
            required
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            onChange={handleSignup}
            required
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-full mt-7">
            signup
          </button>
        </form>
      </section>
    </div>
  );
};

export default Signup;
