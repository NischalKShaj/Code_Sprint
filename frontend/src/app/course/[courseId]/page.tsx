// file to show single course page

// importing the required modules
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CourseId = () => {
  const [course, setCourse] = useState({});
  const { courseId } = useParams() as { courseId: string };
  const router = useRouter();
  // fetching the course according to the id
  // useEffect(() => {
  //   const fetchData = async (id: string) => {
  //     try {
  //       const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${id}`
  //       );
  //       console.log("response", response.data);
  //       if (response.status === 202) {
  //         setCourse(response.data);
  //       } else if (response.status === 500) {
  //         router.push("/error");
  //       } else {
  //         router.push("/");
  //       }
  //     } catch (error: any) {
  //       console.error("error", error);
  //       if (error.response && error.response.status === 401) {
  //         // Handle unauthorized error specifically
  //         router.push("/login");
  //       } else {
  //         // Handle other errors
  //         router.push("/error");
  //       }
  //     }
  //   };
  //   if (courseId) {
  //     fetchData(courseId);
  //   }
  // }, [courseId, router]);
  return (
    <div>
      <h1>{courseId}</h1>
    </div>
  );
};

export default CourseId;
