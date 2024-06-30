"use client";

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
import crypto from "crypto";
dotenv.config();

interface Course {
  _id: string;
  course_name: string;
  description: string;
  course_category: string;
  price: number;
  tutor: string;
  chapters: Chapter[];
}

interface Chapter {
  chapterName: string;
  videos: string[];
}

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
  const id = courseId;
  const router = useRouter();
  const subscribe = CourseState((state) => state.subscribe);
  const unsubscribe = CourseState((state) => state.unsubscribe);
  const subCourses = CourseState((state) => state.isSubscribed);

  const courseSubscribed = subCourses?.some(
    (sub) => sub.course_id === course?._id
  );

  const [decryptedVideos, setDecryptedVideos] = useState<string[]>([]);

  // function to decrypt the videos url
  const decryptVideo = (encryptedUrl: string): string => {
    try {
      console.log("Decrypting video:", encryptedUrl);

      const parts = encryptedUrl.split(":");
      console.log("parts", parts.length);
      if (parts.length !== 3) {
        throw new Error(`Invalid encrypted URL format: ${encryptedUrl}`);
      }

      const iv = Buffer.from(parts[0], "hex");
      const tag = Buffer.from(parts[1], "hex");
      const ciphertext = Buffer.from(parts[2], "hex");
      const key = Buffer.from(process.env.NEXT_PUBLIC_CIPHER_SECRETKEY!, "hex");

      console.log("IV:", iv);
      console.log("Tag:", tag);
      console.log("Ciphertext:", ciphertext);
      console.log("env", process.env.NEXT_PUBLIC_CIPHER_SECRETKEY);

      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(ciphertext, undefined, "utf8");
      decrypted += decipher.final("utf8");

      console.log("Decrypted video URL:", decrypted);

      return decrypted;
    } catch (error: any) {
      console.error("Decryption error:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    setIsLoading(false);
    const fetchData = async (id: string) => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${id}`,
          { id: userData?.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("response", response.data);
        if (response.status === 202) {
          const decryptedCourse = {
            ...response.data.courses,
            chapters: response.data.courses.chapters.map(
              (chapter: Chapter) => ({
                ...chapter,
                videos: chapter.videos.map((video: string) =>
                  decryptVideo(video)
                ),
              })
            ),
          };
          showCourse(decryptedCourse);
          setDecryptedVideos(
            decryptedCourse.chapters.flatMap(
              (chapter: Chapter) => chapter.videos
            )
          );

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

  const handleCheckboxChange = (videoUrl: string) => {
    toggleVideoCompletion(courseId, videoUrl);
  };

  const { completedVideos } = CourseState();
  const courseCompletion =
    completedVideos && completedVideos[courseId]
      ? completedVideos[courseId]
      : {};
  const completedCount = Object.values(courseCompletion).filter(Boolean).length;
  const totalTutorials = decryptedVideos.length;
  const completionPercentage = Math.round(
    (completedCount / totalTutorials) * 100
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = decryptedVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  const renderPagination = () => {
    if (!decryptedVideos.length) return null;

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(decryptedVideos.length / videosPerPage);
      i++
    ) {
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
          course: course?._id,
          amount: course?.price,
        }
      );
      const { id: order_id, currency } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: (course?.price ?? 0) * 100,
        currency,
        name: course?.course_name,
        order_id,
        handler: async function (response: any) {
          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-success`,
              { user: userData?.id, course: course?._id }
            );
            if (res.status === 202) {
              Swal.fire({
                title: "Payment Success!",
                text: "Thank you for subscribing! Get ready to dive into the course and unlock your potential!",
                icon: "success",
                confirmButtonText: "OK",
              });

              const courseDetails = res.data.courses;
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
              }
            } else {
              Swal.fire({
                title: "Payment Failed!",
                text: "Your payment has been rejected!",
                icon: "warning",
                confirmButtonText: "OK",
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Payment Failed!",
              text: "Your payment has been rejected!",
              icon: "warning",
              confirmButtonText: "OK",
            });
          }
        },
        prefill: {
          name: userData?.username,
          email: userData?.email,
          contact: userData?.phone,
        },
        notes: {
          address: "1234 Main Street",
        },
        theme: {
          color: "#1a202c",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe`,
        {
          user_id: userData?.id,
          course_id: course?._id,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Unsubscribed!",
          text: "You have successfully unsubscribed from the course.",
          icon: "success",
          confirmButtonText: "OK",
        });

        unsubscribe(course?._id);
      } else {
        Swal.fire({
          title: "Unsubscription Failed!",
          text: "There was an error while trying to unsubscribe.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error while unsubscribing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Link href="/">
          <span className="text-blue-500 hover:text-blue-700">&larr; Back</span>
        </Link>
        {course ? (
          <>
            <h1 className="text-3xl font-bold mb-4">{course.course_name}</h1>
            <p className="mb-4">{course.description}</p>
            <p className="mb-4">Category: {course.course_category}</p>
            <p className="mb-4">Price: ${course.price}</p>
            <p className="mb-4">Tutor: {course.tutor}</p>
            <div className="my-6">
              <CircularProgressbar
                value={completionPercentage}
                text={`${completionPercentage}%`}
                styles={buildStyles({
                  textColor: "#4a5568",
                  pathColor: "#4a5568",
                  trailColor: "#e2e8f0",
                })}
              />
            </div>

            {!courseSubscribed ? (
              <button
                onClick={handleSubscribe}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            ) : (
              <button
                onClick={handleUnsubscribe}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Unsubscribe
              </button>
            )}

            {currentVideos.length > 0 ? (
              <div className="mt-6">
                {currentVideos.map((videoUrl, index) => (
                  <div key={index} className="mb-6">
                    <video controls src={videoUrl} className="w-full h-auto" />
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={courseCompletion[videoUrl] || false}
                        onChange={() => handleCheckboxChange(videoUrl)}
                        className="mr-2"
                      />
                      <label>{`Video ${
                        index + 1 + (currentPage - 1) * videosPerPage
                      }`}</label>
                    </div>
                  </div>
                ))}
                {renderPagination()}
              </div>
            ) : (
              <div>No videos found for this course.</div>
            )}
          </>
        ) : (
          <div>Course not found.</div>
        )}
      </div>
    </div>
  );
};

export default CourseId;
