"use client";

// importing the required modules
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CourseState } from "@/app/store/courseStore";
dotenv.config();

interface Course {
  id: string;
  course_name: string;
  course_category: string;
  description: string;
  price: number;
  videos: string[];
}

const CourseView = () => {
  const { courseId } = useParams() as { courseId: string };
  const [course, setCourse] = useState<Course | null>(null);
  const setMyCourse = CourseState((state) => state.setMyCourse);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 2;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchData = async (id: string) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/mycourse/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          const modifiedVideos = response.data.videos.map((videoUrl: string) =>
            videoUrl.slice(0, -1)
          );

          setCourse({
            id: response.data._id,
            course_name: response.data.course_name,
            course_category: response.data.course_category,
            description: response.data.description,
            price: response.data.price,
            videos: modifiedVideos,
          });

          setMyCourse({
            id: response.data._id,
            course_name: response.data.course_name,
            course_category: response.data.course_category,
            description: response.data.description,
            price: response.data.price,
            videos: modifiedVideos,
          });
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        router.push("/error");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData(courseId);
    }
  }, [courseId, router]);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getVideoName = (videoUrl: string) => {
    return decodeURIComponent(
      videoUrl.split("/").pop()?.split(".")[1] ?? "Unknown Video"
    );
  };

  const renderVideos = () => {
    if (!course || course.videos.length === 0) {
      return <p>No videos available for this course.</p>;
    }

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = course.videos.slice(
      indexOfFirstVideo,
      indexOfLastVideo
    );

    return (
      <div className="flex flex-col items-center">
        {currentVideos.map((videoUrl, index) => (
          <div key={`${videoUrl}-${index}`} className="mb-6 text-center">
            <h3 className="text-xl mb-2">{getVideoName(videoUrl)}</h3>
            <video
              key={`${videoUrl}-${index}-video`}
              className="rounded-lg w-[500px]"
              controls
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
        <div className="flex justify-center space-x-4 mt-4">
          {Array.from(
            { length: Math.ceil(course.videos.length / videosPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => handleClick(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <SpinnerWrapper>
          <div>Loading...</div>
        </SpinnerWrapper>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <SpinnerWrapper>
          <div>Course not found</div>
        </SpinnerWrapper>
      </div>
    );
  }

  return (
    <div>
      <SpinnerWrapper>
        <div className="course-details flex flex-col justify-start text-end bg-gradient-to-r from-purple-500 to-indigo-500 py-4 px-8">
          <Link className="text-left flex" href="/mycourse">
            Back to courses
          </Link>
          <div className="mr-[300px] text-left ml-[1000px] mt-[100px] mb-5 p-3 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6">{course.course_name}</h1>
            {course.description}
            <p className="text-md mb-4">
              <strong>Category:</strong> {course.course_category}
            </p>
            <div className="flex">
              <p>Price: &#8377; {course.price}</p>
              <Link href={`/mycourse/editCourse/`}>
                <button className="bg-[#2a31f8] ml-[250px] text-white font-bold py-2 px-4 rounded-xl">
                  Edit Course
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-[#D9D9D9] p-8 w-[1000px] rounded-lg mb-7 shadow-md mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Videos:</h2>
          {renderVideos()}
        </div>
      </SpinnerWrapper>
    </div>
  );
};

export default CourseView;
