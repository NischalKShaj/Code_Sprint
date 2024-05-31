// page for showing the tutors courses
"use client";
import Link from "next/link";
import React from "react";
// import { AppState } from "../store";
// import axios from "axios";
// import dotenv from "dotenv";
// import { useRouter } from "next/navigation";
// dotenv.config();

const MyCourse = () => {
  // const router = useRouter();
  // const tutorId = AppState((state) => state.user?.id);
  // const handleAddClick = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/addCourse/${tutorId}`
  //     );
  //     console.log("res", response.data);
  //     router.push(`addCourse/${tutorId}`);
  //   } catch (error) {
  //     console.error("error", error);
  //   }
  // };
  return (
    <div>
      <Link href="/mycourse/addCourse">
        <button>addCourse</button>
      </Link>
    </div>
  );
};

export default MyCourse;
