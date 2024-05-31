"use client";

// Importing the required modules
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AppState } from "../store";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
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

  const getMimeType = (url: any) => {
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
    <div>
      <Link href="/mycourse/addCourse">
        <button>Add Course</button>
      </Link>
      <div>
        {courses.map((courseUrl, index) => (
          <div key={index} style={{ margin: "20px 0" }}>
            <video width="600" controls>
              <source
                src={courseUrl}
                type={getMimeType(courseUrl)}
                onError={(e) =>
                  console.error(`Error loading video at ${courseUrl}:`, e)
                }
              />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
