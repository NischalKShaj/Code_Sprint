// page to show the dashboard for the admin
"use client";
// importing the required modules
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import BarGraph from "@/components/graph/UserBarGraph";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import React from "react";
import TutorBarGraph from "@/components/graph/TutorBarGraph";

const AdminDashboard = () => {
  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <div className="flex mt-[50px] ml-[350px] mr-[150px]">
          <BarGraph />
          <TutorBarGraph />
        </div>
      </SpinnerWrapper>
    </div>
  );
};

export default AdminDashboard;
