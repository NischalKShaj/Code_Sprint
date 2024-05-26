// file to show the login page for the application
"use client";

import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEventHandler, useState } from "react";
import { AppState } from "@/app/store";

const Login = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }
  );
  const router = useRouter();
  const login = AppState((state) => state.isLoggedIn);

  // function for the changing value in the form
  const handleLogin: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;

    setFormData({ ...formData, [target.id]: target.value });
  };

  // function for passing the data from the frontend to the backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("testing");
    try {
      const selectedRole = localStorage.getItem("selectedRole");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        { ...formData, selectedRole }
      );
      console.log(response.data);
      login({ email: formData.email });
      router.push("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <h3 className="text-2xl font-bold mb-6">
        Login to your CodeSprint account
      </h3>
      <section className="bg-[#D9D9D9] p-8 h-[400px] w-[370px] rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* <input
            type="text"
            placeholder="email"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <input
            type="text"
            placeholder="email"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          /> */}
          <input
            type="email"
            id="email"
            placeholder="email"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            onChange={handleLogin}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            onChange={handleLogin}
            required
          />
          <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-full mt-7">
            Login
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
