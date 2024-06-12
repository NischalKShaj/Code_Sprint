"use client";

// Importing the required modules
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AppState } from "../store";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";

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

interface FlattenedVideo {
  courseTitle: string;
  videoUrl: string;
}

const MyCourse: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(5);
  const [courses, setCourses] = useState<Course[]>([]);
  const [flattenedVideos, setFlattenedVideos] = useState<FlattenedVideo[]>([]);
  const tutorId = AppState((state) => state.user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        console.log("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/mycourse/${tutorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setCourses(response.data);
          // Flatten the video URLs into a single list
          const flattened = response.data.flatMap((course: Course) =>
            course.url.map((videoUrl) => ({
              courseTitle: course.title,
              videoUrl,
            }))
          );
          setFlattenedVideos(flattened);
        } else {
          router.push("/login");
        }
      } catch (error) {
        if (!tutorId) {
          router.push("/login");
        } else {
          console.error("Error fetching courses:", error);
          router.push("/error");
        }
      }
    };

    fetchData();
  }, [router, tutorId]);

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

  const getVideoName = (url: string | null | undefined): string => {
    if (!url) {
      console.error("Invalid URL:", url);
      return "Unknown Video";
    }

    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[1];
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = flattenedVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <SpinnerWrapper>
        <h1 className="text-3xl mr-[750px] font-bold mb-6">My Courses</h1>
        <section className="bg-[#D9D9D9] p-8 w-[1000px] rounded-lg shadow-md">
          {currentVideos.map((video, index) => (
            <div key={index} style={{ margin: "20px 0" }}>
              <h3 className="text-2xl text-center font-bold mb-6">
                Course Name: {video.courseTitle}
              </h3>
              <div className="justify-center" style={{ margin: "30px 0" }}>
                <h3 className="text-md text-right mr-[250px] top-[100px] items-center relative">
                  {getVideoName(video.videoUrl)}
                </h3>
                <video className="rounded-lg ml-5" width="300" controls>
                  <source
                    src={video.videoUrl}
                    type={getMimeType(video.videoUrl)}
                    onError={(e) =>
                      console.error(
                        `Error loading video at ${video.videoUrl}:`,
                        e
                      )
                    }
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </section>
        <nav className="mt-4" aria-label="Pagination">
          <ul className="flex justify-center">
            {Array.from({
              length: Math.ceil(flattenedVideos.length / videosPerPage),
            }).map((_, index) => (
              <li key={index}>
                <button
                  className="px-4 py-2 mx-1 bg-gray-200 rounded-md"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </SpinnerWrapper>
    </div>
  );
};

export default MyCourse;
