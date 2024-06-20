// file to show to the current course
"use client";

// importing the required modules
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import dotenv from "dotenv";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
dotenv.config();

const CourseView = () => {
  const { courseId } = useParams() as { courseId: string };

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/mycourse/course/${id}`
        );
        if (response.status === 202) {
          console.log("response", response.data);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    if (courseId) {
      fetchData(courseId);
    }
  });

  return (
    <div>
      <SpinnerWrapper>
        <></>
      </SpinnerWrapper>
    </div>
  );
};

export default CourseView;
