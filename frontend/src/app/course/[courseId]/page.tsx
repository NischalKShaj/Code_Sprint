"use client";

// Import necessary modules
import { CourseState } from "@/app/store/courseStore";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import dotenv from "dotenv";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import { loadScript } from "@/utils/razorpay";
import { AppState } from "@/app/store";
import Swal from "sweetalert2";
dotenv.config();

const CourseId = () => {
  const userData = AppState((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 2;
  const { courseId } = useParams() as { courseId: string };
  const course = CourseState((state) => state.course);
  const showCourse = CourseState((state) => state.showCourse);
  const toggleVideoCompletion = CourseState(
    (state) => state.toggleVideoCompletion
  );
  const router = useRouter();
  const subscribe = CourseState((state) => state.subscribe);
  const subCourses = CourseState((state) => state.isSubscribed);

  const courseSubscribed = subCourses.some(
    (sub) => sub.course_id === course?.course_id
  );

  useEffect(() => {
    setIsLoading(false);
    const fetchData = async (id: string) => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${id}`,
          {
            id: userData?.id,
          },
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
            course_name: response.data.courses.course_name,
            course_category: response.data.courses.course_category,
            description: response.data.courses.description,
            number_of_tutorials: response.data.courses.number_of_videos,
            videos: response.data.courses.videos.map((video: string) => ({
              url: video,
            })),
            course_id: response.data.courses._id,
            tutor_id: response.data.courses.tutor,
            price: response.data.courses.price,
          });

          if (response.data.subCourse) {
            const subscribedCourse = {
              user_id: userData?.id,
              username: userData?.username,
              course_name: response.data.courses.course_name,
              course_category: response.data.courses.course_category,
              description: response.data.courses.description,
              course_id: response.data.courses._id,
              tutor_id: response.data.courses.tutor,
            };
            subscribe([subscribedCourse]);
          }
        } else if (response.status === 500) {
          router.push("/error");
        } else {
          router.push("/");
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          router.push("/login");
        } else {
          router.push("/error");
        }
      }
    };
    if (courseId) {
      fetchData(courseId);
    }
  }, [courseId, router, showCourse, userData?.id, userData?.username]);

  // to handle the course completion status
  const handleCheckboxChange = (video: { url: string }) => {
    toggleVideoCompletion(courseId, video.url);
  };

  const { completedVideos } = CourseState();
  const courseCompletion =
    completedVideos && completedVideos[courseId]
      ? completedVideos[courseId]
      : {};
  const completedCount = Object.values(courseCompletion).filter(Boolean).length;
  const totalTutorials = parseInt(course?.number_of_tutorials || "0", 10);
  const completionPercentage = Math.round(
    (completedCount / totalTutorials) * 100
  );

  // to handle the pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos =
    course?.videos.slice(indexOfFirstVideo, indexOfLastVideo) ?? [];

  const renderPagination = () => {
    if (!course || !course.videos) return null;

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(course.videos.length / videosPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`mx-1 px-3 py-1 rounded-lg ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // function to initiate the online payment
  const handleSubscribe = async () => {
    try {
      const scriptLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/razorpay`,
        {
          user: userData?.id,
          course: course?.course_id,
          amount: course?.price,
        }
      );
      const { id: order_id, currency } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: parseInt(course?.price || "0", 10) * 100,
        currency,
        name: course?.course_name,
        order_id,
        handler: async function (response: any) {
          // to update the subscription
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-success`,
              { user: userData?.id, course: course?.course_id }
            );
            console.log("response", response.data);
            if (response.status === 202) {
              Swal.fire({
                title: "Payment Success!",
                text: "Thank you for subscribing! Get ready to dive into the course and unlock your potential!",
                icon: "success",
                confirmButtonText: "OK",
              });
              // the value is not correctly updated in the state check
              // try mapping the array course
              const courseDetails = response.data.courses;
              console.log("course Details", courseDetails);
              // let subScribedCourse;
              if (courseDetails && courseDetails.length > 0) {
                const subscribedCourses = courseDetails.map(
                  (courseDetail: { tutorId: any; courseId: any }) => ({
                    user_id: userData?.id,
                    username: userData?.username,
                    course_name: course?.course_name,
                    course_category: course?.course_category,
                    description: course?.description,
                    tutor_id: courseDetail.tutorId,
                    course_id: courseDetail.courseId,
                  })
                );

                subscribe(subscribedCourses);
                console.log("Subscribed Courses:", subscribedCourses);
              } else {
                console.error(
                  "Course details are not available in the response"
                );
              }
            } else {
              Swal.fire({
                title: "Payment Failed!",
                text: "Your payment has be rejected!",
                icon: "warning",
                confirmButtonText: "OK",
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Payment Failed!",
              text: "Your payment has be rejected!",
              icon: "warning",
              confirmButtonText: "OK",
            });
            console.error("error", error);
          }
        },
        prefill: {
          name: userData?.username,
          email: userData?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: AxiosError | any) {
      console.error("Error initiating payment: ", error);
    }
  };

  function getVideoName(url: string) {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const nameWithoutExtension = fileName.split(".")[1];
    return nameWithoutExtension;
  }

  return (
    <div>
      <SpinnerWrapper>
        <>
          {course && (
            <>
              <div className="course-details flex flex-col justify-start text-end bg-gradient-to-r from-purple-500 to-indigo-500 py-4 px-8">
                <Link className="text-left flex" href="/course">
                  Back to courses
                </Link>
                <div className="mr-[300px] text-left ml-[1000px] mt-[100px] mb-5 p-3 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg rounded-lg">
                  {course.description}
                  {!courseSubscribed && (
                    <>
                      <button
                        className="bg-[#2a31f8] mt-5 text-white font-bold py-2 px-4 rounded-xl"
                        onClick={handleSubscribe}
                      >
                        Subscribe
                      </button>
                      <p>Price: ${course.price} USD</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex">
                <section className="bg-[#D9D9D9] p-8 ml-[200px] mt-5 mb-5 w-[650px] rounded-lg shadow-lg">
                  <h1 className="text-center text-3xl font-semibold">
                    {course.course_name}
                  </h1>
                  <div className="flex flex-col mt-[30px] grid-cols-2 gap-4">
                    {currentVideos?.map(
                      (video: { url: string }, index: number) => (
                        <div className="flex relative" key={index}>
                          <p className="video-name absolute top-0 left-[50px] bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                            {getVideoName(video.url)}
                          </p>
                          <video
                            src={video.url}
                            className="rounded-lg ml-9"
                            width="300"
                            height="200"
                            controls
                          />
                          <div className="ml-5">
                            <input
                              type="checkbox"
                              className="ml-14 mt-[80px] w-6 h-6"
                              checked={!!courseCompletion[video.url]}
                              onChange={() => handleCheckboxChange(video)}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {renderPagination()}
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
      </SpinnerWrapper>
    </div>
  );
};

export default CourseId;
