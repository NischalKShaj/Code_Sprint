// file for showing the interested videos
"use effect";

// importing the required modules
import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import axios from "axios";
import { AppState } from "@/app/store";
dotenv.config();

interface CourseWithModifiedVideo {
  course_name: string;
  course_category: string;
  video_url: string;
  _id: string;
}

const InterestCarousel = () => {
  const [courses, setCourses] = useState<CourseWithModifiedVideo[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const user = AppState((state) => state.user);
  const id = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      let url;
      if (token) {
        url = `${process.env.NEXT_PUBLIC_BASE_URL}/interested-course?id=${id}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_BASE_URL}/suggested`;
      }
      try {
        const response = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        if (response.status === 202) {
          const modifiedCourses = response.data.map((course: any) => ({
            ...course,
            video_url: course.videos[0].slice(0, -1),
          }));
          setCourses(modifiedCourses);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % courses.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [courses.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex(
      (prevIndex) => (prevIndex - 1 + courses.length) % courses.length
    );
  };

  return (
    <div className="relative w-full">
      <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
        Suggested Courses for You
      </h1>

      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {courses.map((course, index) => (
          <div
            key={course._id}
            className={`absolute inset-0 transition-transform duration-700 ${
              index === currentSlideIndex ? "translate-x-0" : "translate-x-full"
            } ${index === currentSlideIndex - 1 ? "-translate-x-full" : ""}`}
          >
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center text-center">
                {course.video_url && (
                  <video
                    className="w-full h-auto max-h-80 rounded-lg shadow-lg"
                    src={course.video_url}
                    controls={false}
                  />
                )}
                <h3 className="text-lg font-semibold mt-4 text-gray-700">
                  {course.course_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {course.course_category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-5 flex justify-center space-x-4">
        {courses.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlideIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlideIndex(index)}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-gray-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-gray-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default InterestCarousel;
