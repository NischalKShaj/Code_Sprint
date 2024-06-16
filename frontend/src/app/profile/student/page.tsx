"use client";

// Import necessary modules
import axios from "axios";
import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import { AppState } from "../../store";
import { useRouter } from "next/navigation";
import UserSideBar from "@/components/partials/UserSideBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CourseState } from "@/app/store/courseStore";
dotenv.config();

interface Video {
  course_id: string;
  videos: string[];
}

const Profile = () => {
  const [loading, setIsLoading] = useState(true);
  const [subscribedVideos, setSubscribedVideos] = useState<Video[]>([]);
  const user = AppState((state) => state.user);
  const subscribedCourse = CourseState((state) => state.isSubscribed);
  const router = useRouter();
  const subscribe = CourseState((state) => state.subscribe);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 2;

  // static value for the problems submissions
  const easy = 4;
  const medium = 0;
  const hard = 0;
  const totalQuestion = 30;
  const totalQuestionProgress = ((easy + medium + hard) / totalQuestion) * 100;

  useEffect(() => {
    setIsLoading(false);
    const id = user?.id;
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 202) {
          const subscribed = response.data.subscribed;

          const formattedSubscribedCourses = subscribed.map((course: any) => ({
            user_id: user?.id,
            username: user?.username,
            course_name: course.course_name,
            course_category: course.course_category,
            description: course.description,
            tutor_id: course.tutor,
            course_id: course._id,
          }));

          subscribe(formattedSubscribedCourses);

          const formattedSubscribedVideos = subscribed.map((course: any) => ({
            course_id: course._id,
            videos: Array.isArray(course.videos) ? course.videos : [],
          }));

          setSubscribedVideos(formattedSubscribedVideos);
        } else {
          router.push("/login");
        }
      } catch (error) {
        if (!id) {
          router.push("/login");
        } else {
          console.error("Error fetching data:", error);
          router.push("/error");
        }
      }
    };

    fetchData();
  }, [router, user?.id, subscribe]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate index of videos to display based on current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = subscribedCourse.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const handlePagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div>
      <UserSideBar />
      <div className="flex items-center mb-36 bg-white mt-6">
        <section className="bg-[#D9D9D9] p-8 ml-[400px] w-[500px] h-[300px] rounded-lg shadow-lg">
          <h1 className="text-left text-xl font-semibold">Status</h1>
          <div className="flex justify-between items-center h-full">
            <div>
              <div className="flex space-x-5">
                <div className="flex flex-col items-start">
                  <h3 className="text-green-500">Easy</h3>
                  <h3>4/10</h3>
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-yellow-500">Medium</h3>
                  <h3>0/10</h3>
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-red-500">Hard</h3>
                  <h3>0/10</h3>
                </div>
              </div>
            </div>
            <div className="w-[100px] h-[100px]">
              <CircularProgressbar
                value={totalQuestionProgress}
                text={`${easy + medium + hard}/${totalQuestion}`}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: "#4CAF50",
                  textColor: "#000",
                  trailColor: "#A5D6A7",
                })}
              />
            </div>
          </div>
        </section>
        <section className="bg-[#D9D9D9] p-8 ml-[100px] mt-[90px] w-[500px] rounded-lg shadow-lg">
          <h1 className="text-left text-xl font-semibold">My Courses</h1>

          {subscribedCourse.length === 0 ? (
            <p className="text-center mt-4">
              Subscribe to any course to see your courses.
            </p>
          ) : (
            <>
              {currentCourses.map((course) => {
                const courseVideos =
                  subscribedVideos.find(
                    (videoObj) => videoObj.course_id === course.course_id
                  )?.videos || [];
                const firstVideo =
                  courseVideos.length > 0 ? courseVideos[0] : null;

                return (
                  <div
                    key={course.course_id}
                    className="mt-[60px] space-y-6 flex items-center"
                  >
                    <div>
                      <h3>Course name: {course.course_name}</h3>
                      {firstVideo ? (
                        <video
                          className="rounded-lg ml-0"
                          width="300"
                          height="200"
                          controls
                        >
                          <source src={firstVideo} type="video/webm" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <p>No videos available</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls */}
              <div className="mt-4 flex justify-center">
                {Array.from(
                  {
                    length: Math.ceil(subscribedCourse.length / coursesPerPage),
                  },
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePagination(index + 1)}
                      className={`mx-1 px-3 py-1 rounded ${
                        currentPage === index + 1
                          ? "bg-gray-300"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </div>
      <section className="bg-[#D9D9D9] p-8 ml-[400px] mt-[-60px] mb-5 w-[1100px] rounded-lg shadow-lg">
        <h1 className="text-left text-xl font-semibold">Daily active status</h1>
        <div className="mt-[20px] flex items-center">
          {/* <div>
            <h3>Course name: {""}</h3>
            <video
              className="rounded-lg ml-0"
              width="300"
              height="200"
              controls
            >
              videos: {""}
            </video>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Profile;
