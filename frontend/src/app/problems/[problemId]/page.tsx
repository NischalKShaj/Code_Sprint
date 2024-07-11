// page to show each problems
"use client";

// importing required modules
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import dotenv from "dotenv";
dotenv.config();

const ProblemId = () => {
  const { problemId } = useParams() as { problemId: string };

  // fetching the data for the question
  useEffect(() => {
    const fetchData = async (id: string) => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/problems/${id}`,
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
    if (problemId) {
      fetchData(problemId);
    }
  });

  return (
    <div>
      <></>
    </div>
  );
};

export default ProblemId;
