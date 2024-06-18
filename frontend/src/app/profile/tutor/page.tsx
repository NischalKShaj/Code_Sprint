// file to show the tutors profile page
"use client";

// importing the required modules
import { AppState } from "@/app/store";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import TutorSideBar from "@/components/partials/TutorSideBar";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TutorProfilePage = () => {
  const [loading, setIsLoading] = useState(true);
  const user = AppState((state) => state.user);
  const router = useRouter();
  const [totalSub, setTotalSub] = useState(0);

  useEffect(() => {
    setIsLoading(false);
    const id = user?.id;
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile/tutor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 202) {
          //
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
  }, [router, user?.id, user?.username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate index of videos to display based on current page
  //   const indexOfLastCourse = currentPage * coursesPerPage;
  //   const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  //   const currentCourses = subscribedCourse.slice(
  //     indexOfFirstCourse,
  //     indexOfLastCourse
  //   );
  //   const handlePagination = (pageNumber: number) => {
  //     setCurrentPage(pageNumber);
  //   };
  return (
    <div>
      <SpinnerWrapper>
        <TutorSideBar />
        <div className="flex items-center mb-36 bg-white mt-6">
          <section className="bg-[#D9D9D9] p-8 ml-[400px] w-[800px] rounded-lg shadow-lg">
            <h1 className="text-left text-xl font-semibold">
              Total Subscribers
            </h1>
            <div className="flex justify-between items-center">
              <h3>Total subscribes</h3>
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

export default TutorProfilePage;
