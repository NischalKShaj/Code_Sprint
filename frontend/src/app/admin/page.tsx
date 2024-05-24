// page to show the login page for the admin

import React from "react";

const AdminLogin = () => {
  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <h3 className="text-2xl font-bold mb-6">Admin Panel Access</h3>
      <section className="bg-[#D9D9D9] p-8 h-[290px] w-[370px] rounded-lg shadow-md">
        <form action="">
          <input
            type="text"
            placeholder="email"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <input
            type="password"
            placeholder="password"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
          />
          <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-full mt-7">
            Login
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminLogin;
