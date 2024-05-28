// file to show the login page for the application
"use client";

import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { AppState } from "@/app/store";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }
  );
  const router = useRouter();
  const login = AppState((state) => state.isLoggedIn);
  const authorized = AppState((state) => state.isAuthorized);

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
      // const selectedRole = localStorage.getItem("selectedRole");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      login({ email: formData.email });
      router.push("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  //  for google and github authentication purpose
  const handleOAuth = async (provider: string) => {
    try {
      if (provider === "google") {
        await signIn(provider, {
          callbackUrl: "/",
          onSuccess: () => {
            setIsAuthenticated(true);
          },
        });
      } else if (provider === "github") {
        await signIn(provider, {
          callbackUrl: "/",
          onSuccess: () => {
            setIsAuthenticated(true);
          },
        });
      }
    } catch (error) {
      console.error("error", error);
      setIsAuthenticated(false);
    }
  };

  // use effect to check the user is authenticated or not
  useEffect(() => {
    if (authorized) {
      router.push("/");
    }
  }, [authorized]);

  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <h3 className="text-2xl font-bold mb-6">
        Login to your CodeSprint account
      </h3>
      <section className="bg-[#D9D9D9] p-8 h-[400px] w-[370px] rounded-lg shadow-md">
        <button
          onClick={() => handleOAuth("google")}
          className="p-4 bg-gray-50 border test border-gray-300 rounded-lg  w-full mt-3"
        >
          <FontAwesomeIcon className="mr-5" icon={faGoogle} />
          continue with google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
        >
          <FontAwesomeIcon className="mr-5" icon={faGithub} />
          continue with github
        </button>
        <form onSubmit={handleSubmit}>
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
