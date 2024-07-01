// page to show the dashboard for the admin
"use client";
// importing the required modules
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import BarGraph from "@/components/graph/UserBarGraph";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import React, { useEffect, useLayoutEffect } from "react";
import TutorBarGraph from "@/components/graph/TutorBarGraph";
import { AppState } from "@/app/store";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const isAdmin = AppState((state) => state.isAdmin);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isAdmin) {
      router.push("/admin");
    }
  });

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
