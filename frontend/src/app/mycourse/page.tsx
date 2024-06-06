// file for showing tutors courses
"use client";

// Importing the required modules
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AppState } from "../store";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const tutorId = AppState((state) => state.user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        console.log("token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/mycourse/${tutorId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setCourses(response.data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        if (!tutorId) {
          router.push("/login");
        }
        console.error("Error fetching courses:", error);
      }
    };

    // if (tutorId) {
    // }
    fetchData();
  }, [tutorId]);

  // function for extracting the url of the videos
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

  // function for getting the name of the videos
  const getVideoName = (url: string): string => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  };

  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <h1 className="text-3xl mr-[750px] font-bold mb-6">My Courses</h1>
      <section className="bg-[#D9D9D9] p-8 h-[1000px] w-[1000px] rounded-lg shadow-md">
        {courses.map((course) => (
          <div key={course._id} style={{ margin: "20px 0" }}>
            <h3 className="text-2xl text-center font-bold mb-6">
              course name: {course.title}
            </h3>
            {course.url.map((videoUrl, videoIndex) => (
              <div
                key={videoIndex}
                className="justify-center"
                style={{ margin: "30px 0" }}
              >
                <h3 className="text-md text-right mr-[250px] top-[100px] items-center relative">
                  here {getVideoName(videoUrl)}
                </h3>
                <video className="rounded-lg ml-5" width="300" controls>
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
