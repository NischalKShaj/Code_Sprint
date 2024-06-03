// page to show the dashboard for the admin
"use client";
// importing the required modules
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import BarGraph from "@/components/partials/BarGraph";
import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <AdminSidePanel />
      <div className="mt-[50px] ml-[350px] mr-[150px]">
        <BarGraph />
      </div>
    </div>
  );
};

export default AdminDashboard;
