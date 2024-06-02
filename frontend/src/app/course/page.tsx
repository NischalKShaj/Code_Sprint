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

  // function to get the videos type
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

  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <h1 className="text-3xl mr-[500px] font-bold mb-6">
        Explore, Learn, Achieve, Master
      </h1>
      <section className="bg-[#D9D9D9] p-8 h-[1000px] w-[1000px] rounded-lg shadow-md">
        {courses.map((course) => (
          <div
            key={course._id}
            className="flex items-start border border-black p-4 mb-4 rounded-lg"
          >
            {course.videos && course.videos.length > 0 && (
              <video className="rounded-lg w-72 mr-4" controls>
                <source
                  src={course.videos[0]}
                  type={getMimeType(course.videos[0])}
                />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="ml-[100px] mt-[50px]">
              <h2 className="text-xl font-bold mb-2">{course.course_name}</h2>
              <p className="text-sm mb-1">
                Course Category: {course.course_category}
              </p>
              <p className="text-sm">{course.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Course;
