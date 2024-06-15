// file to create profile for the user and the tutor
"use client";

// importing the required modules
import axios from "axios";
import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import { AppState } from "../../store";
import { useRouter } from "next/navigation";
import UserSideBar from "@/components/partials/UserSideBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { CourseState } from "@/app/store/courseStore";
dotenv.config();

const Profile = () => {
  const user = AppState((state) => state.user);
  const subscribedCourse = CourseState((state) => state.isSubscribed);
  console.log("subCourse", subscribedCourse);
  const courseCompletion = CourseState((state) => state.completedVideos);
  console.log("course", courseCompletion);
  const router = useRouter();

  useEffect(() => {
    const id = user?.id;
    const token = localStorage.getItem("access_token");
    console.log(token);
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
          // area to set the profile details after the completion of the subscription and the google works
        } else {
          router.push("/login");
        }
      } catch (error) {
        if (!id) {
          router.push("/login");
        } else {
          console.error("error", error);
          router.push("/error");
        }
      }
    };
    fetchData();
  }, [router, user?.id]);

  return (
    <div>
      <UserSideBar />
      <div className="flex items-center mb-36 bg-white mt-6">
        <section className="bg-[#D9D9D9] p-8 ml-[400px]  w-[500px] h-[300px] rounded-lg shadow-lg">
          <h1 className="text-left text-xl font-semibold">
            Course Completion Status
          </h1>
          <div className="mt-[60px] space-y-6 flex items-center">
            <div>
              <h3>Total Tutorials: {""}</h3>
              <h3>Completed: {"completedCount"}</h3>
            </div>
            <div className="ml-4">
              <div className="w-[100px] h-[100px] ml-[100px]">
                <CircularProgressbar
                  value={10}
                  text={`%`}
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
        <section className="bg-[#D9D9D9] p-8 ml-[100px] mt-5  w-[500px] rounded-lg shadow-lg">
          <h1 className="text-left text-xl font-semibold">My Courses</h1>
          <div className="mt-[60px] space-y-6 flex items-center">
            <div>
              <h3>Course name: {""}</h3>
              <video
                className="rounded-lg ml-0"
                width="300"
                height="200"
                controls
              >
                videos: {""}
              </video>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-[#D9D9D9] p-8 ml-[400px] mt-[-60px] mb-5 w-[1100px] rounded-lg shadow-lg">
        <h1 className="text-left text-xl font-semibold">Daily active status</h1>
        <div className="mt-[20px] flex items-center">
          <div>
            <h3>Course name: {""}</h3>
            <video
              className="rounded-lg ml-0"
              width="300"
              height="200"
              controls
            >
              videos: {""}
            </video>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
