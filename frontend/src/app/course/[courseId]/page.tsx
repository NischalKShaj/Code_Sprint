"use client";

// importing the required modules
import { CourseState } from "@/app/store/courseStore";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CourseId = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { courseId } = useParams() as { courseId: string };
  const course = CourseState((state) => state.course);
  const showCourse = CourseState((state) => state.showCourse);
  // const completedVideos = CourseState((state) => state.completedVideos) || {};
  const toggleVideoCompletion = CourseState(
    (state) => state.toggleVideoCompletion
  );
  console.log("course", course);
  const router = useRouter();

  // fetching the course according to the id
  useEffect(() => {
    setIsLoading(false);
    const fetchData = async (id: string) => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("response", response.data);
        if (response.status === 202) {
          showCourse({
            course_name: response.data.course_name,
            course_category: response.data.course_category,
            description: response.data.description,
            number_of_tutorials: response.data.number_of_videos,
            videos: response.data.videos.map((video: string) => ({
              url: video,
            })),
            course_id: response.data._id,
            tutor_id: response.data.tutor,
            price: response.data.price,
          });
        } else if (response.status === 500) {
          router.push("/error");
        } else {
          router.push("/");
        }
      } catch (error: any) {
        console.error("error", error);
        if (error.response && error.response.status === 401) {
          // Handle unauthorized error specifically
          router.push("/login");
        } else {
          // Handle other errors
          router.push("/error");
        }
      }
    };
    if (courseId) {
      fetchData(courseId);
    }
  }, [courseId, router, showCourse]);

  const handleCheckboxChange = (video: { url: string }) => {
    toggleVideoCompletion(courseId, video.url);
  };

  // const { completedVideos } = CourseState(); // Access completedVideos directly
  const { completedVideos } = CourseState();
  const courseCompletion =
    completedVideos && completedVideos[courseId]
      ? completedVideos[courseId]
      : {};
  // Check for undefined

  const completedCount = Object.values(courseCompletion).filter(Boolean).length;
  const totalTutorials = parseInt(course?.number_of_tutorials || "0", 10);
  const completionPercentage = Math.round(
    (completedCount / totalTutorials) * 100
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <>
        {course && (
          <>
            <div className="course-details flex justify-start text-end bg-gradient-to-r from-purple-500 to-indigo-500 py-4 px-8 h-[300px]">
              <Link className="text-left flex" href="/course">
                Back to courses
              </Link>
              <h1 className="mr-[300px] text-left ml-[1000px] mt-[100px] mb-5 p-3 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg rounded-lg">
                Category:{course.course_category} <br />
                Course Details Page: {course.description}
                <button className="bg-[#2a31f8] mt-5 text-white font-bold py-2 px-4 rounded-xl">
                  Subscribe
                </button>
                <p>price: &#8377;{course.price}</p>
              </h1>
            </div>
            <div className="flex">
              <section className="bg-[#D9D9D9] p-8 ml-[200px] mt-5 mb-5 w-[500px] rounded-lg shadow-lg">
                <h1 className="text-center text-3xl font-semibold">
                  {course.course_name}
                </h1>
                <div className="flex flex-col grid-cols-2 gap-4">
                  {course.videos.map(
                    (video: { url: string }, index: number) => (
                      <div className="flex" key={index}>
                        <video
                          src={video.url}
                          className="rounded-lg ml-5"
                          width="300"
                          height="200"
                          controls
                        />
                        <input
                          type="checkbox"
                          className="ml-14 mt-[80px] w-6 h-6"
                          checked={!!courseCompletion[video.url]}
                          onChange={() => handleCheckboxChange(video)}
                        />
                      </div>
                    )
                  )}
                </div>
              </section>
              <section className="bg-[#D9D9D9] p-8 ml-[300px] mt-5 mb-5 w-[500px] h-[300px] rounded-lg shadow-lg">
                <h1 className="text-left text-xl font-semibold">
                  Course Completion Status
                </h1>
                <div className="mt-[60px] space-y-6 flex items-center">
                  <div>
                    <h3>Total Tutorials: {totalTutorials}</h3>
                    <h3>Completed: {completedCount}</h3>
                  </div>
                  <div className="ml-4">
                    <div className="w-[100px] h-[100px] ml-[100px]">
                      <CircularProgressbar
                        value={completionPercentage}
                        text={`${completionPercentage}%`}
                        styles={buildStyles({
                          textSize: "16px",
                          pathColor: "#4CAF50",
                          textColor: "#000",
                          trailColor: "#A5D6A7",
                        })}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default CourseId;
