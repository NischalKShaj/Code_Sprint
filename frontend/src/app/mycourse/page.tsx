"use client";

// Importing the required modules
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AppState } from "../store";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import TutorSideBar from "@/components/partials/TutorSideBar";

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
  courseId: string;
}

interface FlattenedVideo {
  courseTitle: string;
  videoUrl: string;
  description: string;
  courseId: string; // Include courseId here
}

const MyCourse: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [flattenedVideos, setFlattenedVideos] = useState<FlattenedVideo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 5; // Number of videos per page
  const tutorId = AppState((state) => state.user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
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
          // Flatten the video URLs into a single list, but only the first video of each course
          const flattened = response.data
            .map((course: Course) => {
              return course.url.length > 0
                ? {
                    courseTitle: course.title,
                    videoUrl: course.url[0],
                    description: course.description,
                    courseId: course.courseId, // Include the courseId here
                  }
                : null;
            })
            .filter(Boolean); // Filter out any null values
          setFlattenedVideos(flattened as FlattenedVideo[]);
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

  // const showCoursePage = (courseId: string) => {
  //   // Handle showing the course page with the given courseId
  //   console.log(`Show course with ID: ${courseId}`);
  //   // You can navigate to another page or perform any action with the courseId here
  // };

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

  // Get current videos for pagination
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = flattenedVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <SpinnerWrapper>
        <TutorSideBar />
        {/* <h1 className="text-3xl mr-[750px] font-bold mb-6">My Courses</h1> */}
        <section className="bg-[#D9D9D9] p-8 w-[1000px] rounded-lg shadow-md">
          {currentVideos.map((video, index) => (
            <div key={index} style={{ margin: "20px 0" }}>
              <h3 className="text-2xl text-center font-bold mb-6">
                {video.courseTitle}
              </h3>
              <div className="mb-6">
                <p className="text-md text-left mb-4">{video.description}</p>
                <div className="flex justify-center">
                  <video className="rounded-lg" width="600" controls>
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
                <div className="flex justify-end mt-4">
                  <Link href={`/mycourse/${video.courseId}`}>
                    <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl">
                      Show
                    </button>
                  </Link>
                </div>
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
