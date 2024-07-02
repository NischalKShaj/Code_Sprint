"use client";

// Import necessary modules
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import dotenv from "dotenv";
import UserSideBar from "@/components/partials/UserSideBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import crypto from "crypto";
import { CourseState } from "@/app/store/courseStore";
import Link from "next/link";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import { AppState } from "@/app/store";
import { useRouter } from "next/navigation";
dotenv.config();

interface Video {
  course_id: string;
  chapter: Chapter[];
}

interface Chapter {
  chapterName: string;
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
  const coursesPerPage = 1;
  const isAuthenticated = AppState((state) => state.isAuthorized);

  // static value for the problems submissions
  const easy = 4;
  const medium = 0;
  const hard = 0;
  const totalQuestion = 30;
  const totalQuestionProgress = ((easy + medium + hard) / totalQuestion) * 100;

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const id = user?.id;
      const token = localStorage.getItem("access_token");
      console.log("token", token);

      if (!id || !token) {
        router.push("/login");
        return;
      }

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
          const subscribed = response.data.subscribed || [];

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
            chapter: course.chapters.map((chapter: any) => ({
              chapterName: chapter.chapterName,
              videos: chapter.videos.map((video: string) =>
                decryptVideo(video)
              ),
            })),
          }));

          setSubscribedVideos(formattedSubscribedVideos);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, user?.id, subscribe]);

  // function to decrypt the videos
  const decryptVideo = (encryptedUrl: string): string => {
    try {
      const parts = encryptedUrl.split(":");
      if (parts.length !== 3) {
        throw new Error(`Invalid encrypted URL format: ${encryptedUrl}`);
      }

      const iv = Buffer.from(parts[0], "hex");
      const tag = Buffer.from(parts[1], "hex");
      const ciphertext = Buffer.from(parts[2], "hex");
      const key = Buffer.from(process.env.NEXT_PUBLIC_CIPHER_SECRETKEY!, "hex");

      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(ciphertext, undefined, "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error: any) {
      console.error("Decryption error:", error.message);
      throw error;
    }
  };

  const handlePagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <SpinnerWrapper>
        <div>Loading...</div>
      </SpinnerWrapper>
    );
  }

  // Calculate index of videos to display based on current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = subscribedCourse.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  return (
    <div>
      <SpinnerWrapper>
        <UserSideBar />
        <div className="flex items-center mb-36 bg-white mt-6">
          <section className="bg-[#D9D9D9] p-8 ml-[400px] w-[500px] h-[300px] rounded-lg shadow-lg">
            <h1 className="text-left text-xl font-semibold">Solved Problems</h1>
            <div className="flex justify-between items-center h-[200px]">
              <div>
                <div className="flex space-x-5">
                  <div className="flex flex-col items-start">
                    <h2 className="text-green-500 font-bold">Easy</h2>
                    <h3>4/10</h3>
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-yellow-500 font-bold">Medium</h2>
                    <h3>0/10</h3>
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-red-500 font-bold">Hard</h2>
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
          <section className="bg-[#D9D9D9] p-8 ml-[100px] mt-11 w-[500px] rounded-lg shadow-lg">
            <h1 className="text-left text-xl font-semibold">My Courses</h1>

            {subscribedCourse.length === 0 ? (
              <p className="text-center mt-4">
                Subscribe to any course to see your courses.
              </p>
            ) : (
              <>
                {currentCourses.map((course) => {
                  const foundCourse = subscribedVideos.find(
                    (videoObj) => videoObj.course_id === course.course_id
                  );

                  if (
                    !foundCourse ||
                    !foundCourse.chapter ||
                    foundCourse.chapter.length === 0
                  ) {
                    return (
                      <div
                        key={course.course_id}
                        className="space-y-6 flex items-center"
                      >
                        <div className="flex flex-col mt-8">
                          <h3>Course name: {course.course_name}</h3>
                          <p>No videos available</p>
                        </div>
                      </div>
                    );
                  }

                  const firstChapter = foundCourse.chapter[0];
                  const firstVideo =
                    firstChapter && firstChapter.videos.length > 0
                      ? firstChapter.videos[0]
                      : null;

                  return (
                    <div
                      key={course.course_id}
                      className="space-y-6 flex items-center"
                    >
                      <div className="flex flex-col mt-8">
                        <h3>Course name: {course.course_name}</h3>
                        {firstVideo ? (
                          <video
                            className="rounded-lg ml-0"
                            width="300"
                            height="200"
                          >
                            <source src={firstVideo} type="video/webm" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <p>No videos available</p>
                        )}
                      </div>
                      {firstVideo && (
                        <Link href={`/course/${course.course_id}`}>
                          <button className="bg-[#686DE0] text-white font-bold py-2 px-4 ml-[50px] rounded-xl">
                            Show
                          </button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </>
            )}

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
          </section>
        </div>
        <section className="bg-[#D9D9D9] p-8 ml-[400px] mt-[-60px] mb-5 w-[1100px] rounded-lg shadow-lg">
          <h1 className="text-left text-xl font-semibold">
            Daily active status
          </h1>
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
      </SpinnerWrapper>
    </div>
  );
};

export default Profile;
