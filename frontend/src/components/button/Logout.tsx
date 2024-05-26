// button to perform logging out of the user
import React from "react";
import { AppState } from "@/app/store";

const Logout = () => {
  const { isLoggedOut } = AppState();

  return (
    <div>
      <button
        onClick={isLoggedOut}
        className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl absolute mr-3 mt-16 mx-24"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
