// page for the otp verification
"use client";
import axios from "axios";
import React, { ChangeEventHandler, useState } from "react";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
dotenv.config();

const OTP = () => {
  const [otp, setOtp] = useState({});
  const router = useRouter();
  // adding the otp to the state
  const handleValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    setOtp({ ...otp, [target.id]: target.value });
  };

  // function for passing the otp to the backend
  const handleOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const selectedRole = localStorage.getItem("selectedRole");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/otp`,
        { ...otp, selectedRole }
      );
      console.log(response.data);
      router.push("/login");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <section className="bg-gray-100 p-8 h-[400px] w-[400px] rounded-3xl shadow-md">
        <h3 className="text-center text-2xl font-bold mb-6">
          OTP Verification
        </h3>

        <div className="mb-6">
          <form onSubmit={handleOtp}>
            <label
              htmlFor="email"
              className="text-gray-700 text-center font-bold mb-2 block"
            >
              Please enter the OTP sent to n********5@gmail.com
            </label>
            <div className="mt-11 flex justify-between space-x-4">
              <input
                type="text"
                id="otp1"
                onChange={handleValue}
                maxLength={1}
                required
                className="w-1/6 p-3 rounded-lg bg-gray-200 border border-gray-300 outline-none focus:border-indigo-500 text-center"
              />
              <input
                type="text"
                id="otp2"
                onChange={handleValue}
                maxLength={1}
                required
                className="w-1/6 p-3 rounded-lg bg-gray-200 border border-gray-300 outline-none focus:border-indigo-500 text-center"
              />
              <input
                type="text"
                id="otp3"
                onChange={handleValue}
                required
                maxLength={1}
                className="w-1/6 p-3 rounded-lg bg-gray-200 border border-gray-300 outline-none focus:border-indigo-500 text-center"
              />
              <input
                type="text"
                id="otp4"
                onChange={handleValue}
                maxLength={1}
                required
                className="w-1/6 p-3 rounded-lg bg-gray-200 border border-gray-300 outline-none focus:border-indigo-500 text-center"
              />
            </div>
            <div className="mt-16 flex justify-center items-center">
              <button className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">
                Verify
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default OTP;
