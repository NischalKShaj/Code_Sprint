// file to show the daily problems
"use client";

// importing the required module
import axios from "axios";
import React, { useEffect } from "react";

const DailyProblem = () => {
  // initial loading to get the daily problems
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/problem/dailyProblems`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          console.log("response", response.data);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  });
  return (
    <div>
      <>daily problem</>
    </div>
  );
};

export default DailyProblem;
