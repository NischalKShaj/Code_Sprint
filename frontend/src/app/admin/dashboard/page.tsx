// page to show the dashboard for the admin
"use client";
// importing the required modules
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import BarGraph from "@/components/graph/UserBarGraph";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import React, { useLayoutEffect, useState } from "react";
import TutorBarGraph from "@/components/graph/TutorBarGraph";
import { AppState } from "@/app/store";
import { useRouter } from "next/navigation";
import CourseBarGraph from "@/components/graph/CourseBarGraph";

const AdminDashboard = () => {
  const isAdmin = AppState((state) => state.isAdmin);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!isAdmin) {
      router.push("/admin");
    } else {
      setLoading(false);
    }
  }, [isAdmin, router]);

  if (loading) {
    return (
      <SpinnerWrapper>
        <div>Loading...</div>
      </SpinnerWrapper>
    );
  }

  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <div className="flex mt-[50px] ml-[350px] mr-[150px]">
          <BarGraph />
          <TutorBarGraph />
        </div>
        <div className="ml-[350px] mr-[150px]">
          <CourseBarGraph />
        </div>
      </SpinnerWrapper>
    </div>
  );
};

export default AdminDashboard;
