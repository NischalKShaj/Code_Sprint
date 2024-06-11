"use client";

// importing the required modules
import { CourseState } from "@/app/store/courseStore";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import dotenv from "dotenv";
// import { PayPalButton } from "react-paypal-button-v2";
dotenv.config();

const CourseId = () => {
  const [scriptLoading, setScriptLoading] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 2;
  const { courseId } = useParams() as { courseId: string };
  const course = CourseState((state) => state.course);
  const showCourse = CourseState((state) => state.showCourse);
  const toggleVideoCompletion = CourseState(
    (state) => state.toggleVideoCompletion
  );
  console.log("course", course);
  const router = useRouter();

  // for paypal gateway
  const addPayPal = () => {
    if (window.paypal) {
      setScriptLoading(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=AY1cdDvuGZktEjFWaavwMKK083K7ucQGDduLDDA1xH6eTN-n23ripgvvG9jWqvdHczkeUPPpeb-jAdzJ`;
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      setScriptLoading(true);
    };

    script.onerror = (error) => {
      console.error("Error loading PayPal SDK", error);
    };

    document.body.appendChild(script);

    setTimeout(() => {
      console.log("PayPal SDK after delay", window.paypal);
    }, 2000);
  };

  useEffect(() => {
    addPayPal();
  }, []);

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

  function getVideoName(url: string) {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const nameWithoutExtension = fileName.split(".")[1];
    return nameWithoutExtension;
  }

  return (
    <div>
      <>
        {course && (
          <>
            <div className="course-details flex flex-col justify-start text-end bg-gradient-to-r from-purple-500 to-indigo-500 py-4 px-8 ">
              <Link className="text-left flex" href="/course">
                Back to courses
              </Link>
              <h1 className="mr-[300px] text-left ml-[1000px] mt-[100px] mb-5 p-3 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg rounded-lg">
                {course.description}
                <button
                  className="bg-[#2a31f8] mt-5 text-white font-bold py-2 px-4 rounded-xl"
                  onClick={() => {
                    if (!paypalEnabled) {
                      setPaypalEnabled(true);
                    }
                  }}
                >
                  Subscribe
                </button>

                {/* will be done after the review */}
                {/* {paypalEnabled && (
                  // <PayPalButton
                  //   amount={course?.price}
                  //   onSuccess={(details: any, data: any) => {
                  //     alert(
                  //       "Transaction completed by " +
                  //         details.payer.name.given_name
                  //     );

                  //     return fetch("/paypal-transaction-complete", {
                  //       method: "post",
                  //       body: JSON.stringify({
                  //         orderID: data.orderID,
                  //       }),
                  //     });
                  //   }}
                  // />
                )} */}
                <p>price: ${course.price} USD</p>
              </h1>
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
    </div>
  );
};

export default CourseId;
