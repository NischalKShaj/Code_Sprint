// file for showing tutors courses
"use client";
// Importing the required modules

// Importing the required modules
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AppState } from "../store";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface VideoDetails {
  url: string;
  key: string;
  originalname: string;
}

interface Course {
  title: string;
  description: string;
  url: string[];
  _id: string;
}

const MyCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const tutorId = AppState((state) => state.user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/mycourse/${tutorId}`
        );
        if (response.status === 200) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (tutorId) {
      fetchData();
    }
  }, [tutorId]);

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
    <div className="flex flex-col text-left items-center mb-36 bg-white mt-16">
      <h3 className="text-2xl font-bold mb-6">My Courses</h3>
      <section className="bg-[#D9D9D9] p-8 h-[1000px] w-[1000px] rounded-lg shadow-md">
        {courses.map((course) => (
          <div key={course._id} style={{ margin: "20px 0" }}>
            <h3 className="text-2xl font-bold mb-6">{course.title}</h3>
            {/* show the category here */}
            {course.url.map((videoUrl, videoIndex) => (
              <div key={videoIndex} style={{ margin: "30px 0" }}>
                <p className="text-md mb-2">{getVideoName(videoUrl)}</p>
                <video className="rounded-lg" width="300" controls>
                  <source
                    src={videoUrl}
                    type={getMimeType(videoUrl)}
                    onError={(e) =>
                      console.error(`Error loading video at ${videoUrl}:`, e)
                    }
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        ))}
        <Link href="/mycourse/addCourse">
          <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-full mt-[170px]">
            Add Course
          </button>
        </Link>
      </section>
    </div>
  );
};

export default MyCourse;
