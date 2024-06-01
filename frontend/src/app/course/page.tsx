// file to show all the courses
"use client";

// import all the required modules
import axios from "axios";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
dotenv.config();

interface VideoDetails {
  url: string;
  key: string;
  originalname: string;
}

interface Course {
  course_name: string;
  description: string;
  course_category: string;
  videos: string[];
  _id: string;
}

const Course = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses`
        );
        if (response.status === 200) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("error fetching the course page", error);
      }
    };
    fetchData();
  }, []);

  const getMimeType = (url: string): string => {
    const extension = url.split(".").pop();
    switch (extension) {
      case "mp4":
        return "video/mp4";
      case "webm":
        return "video/webm";
      default:
        return "video/mp4";
    }
  };

  const getVideoName = (url: string): string => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  };

  return (
    <div>
      <h1>Course</h1>
      {courses.map((course) => (
        <div key={course._id}>
          <h2>{course.course_name}</h2>
          <p>{course.description}</p>
          <p>Course Category: {course.course_category}</p>
          {course.videos && course.videos.length > 0 && (
            <video controls>
              <source
                src={course.videos[0]}
                type={getMimeType(course.videos[0])}
              />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ))}
    </div>
  );
};

export default Course;
