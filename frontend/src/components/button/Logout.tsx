// button to perform logging out of the user
import React from "react";
import { AppState } from "@/app/store";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { useRouter } from "next/navigation";

const Logout = () => {
  const { isLoggedOut } = AppState();
  const router = useRouter();

  // function for logging out the system
  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("access_token");
      isLoggedOut();
      router.push("/");
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl mr-3 mt-16 mx-44 absolute"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
