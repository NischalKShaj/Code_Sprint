"use client";

// import all the required modules
import axios from "axios";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
import { CourseState } from "../store/courseStore";
import { AppState } from "../store";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
dotenv.config();

interface VideoDetails {
  url: string;
  key: string;
  originalname: string;
}

interface Course {
  course_name: string;
  description: string;
  course_category: string;
  videos: string[];
  _id: string;
}

const Course = () => {
  const showCourse = CourseState((state) => state.showCourse);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5); // Number of courses to show per page
  const user = AppState((state) => state.user);
  let role: string;
  if (user?.role === "student") {
    role = "student";
  }
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        console.log("access_token", token);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setCourses(response.data);
        } else if (response.status === 500) {
          router.push("/error");
        } else {
          router.push("/");
        }
      } catch (error: any) {
        console.error("error fetching the course page", error);
        if (error.response && error.response.status === 401) {
          router.push("/login");
        } else {
          router.push("/error");
        }
      }
    };
    fetchData();
  }, [router]);

  // function to get the videos type
  const getMimeType = (url: string): string => {
    const extension = url.split(".").pop();
    switch (extension) {
      case "webm":
        return "video/webm";
      default:
        return "video/mp4";
    }
  };

  // function for showing the main course page and the payment details etc..
  const handleSubscribe = async (id: string) => {
    console.log("inside");
    try {
      const token = localStorage.getItem("access_token");
      console.log("token", token);
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
          videos: response.data.videos.map((video: string) => ({ url: video })),
          course_id: response.data._id,
          tutor_id: response.data.tutor,
          price: response.data.price,
        });
        router.push(`course/${id}`);
      } else if (response.status === 500) {
        router.push("/error");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("error");
      if (error.response && error.response.status === 401) {
        router.push("/login");
      } else {
        router.push("/error");
      }
    }
  };

  // Get current courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center mb-36 bg-white mt-16">
      <SpinnerWrapper>
        <h1 className="text-3xl mr-[500px] font-bold mb-6">
          Explore, Learn, Achieve, Master
        </h1>
        <section className="bg-[#D9D9D9] p-8 w-[1300px] rounded-lg shadow-md">
          {currentCourses.map((course) => (
            <div
              key={course._id}
              className="flex items-start border border-black p-4 mb-4 rounded-lg relative"
            >
              {course.videos && course.videos.length > 0 && (
                <video className="rounded-lg w-72 mr-4" controls>
                  <source
                    src={course.videos[0]}
                    type={getMimeType(course.videos[0])}
                  />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="ml-[100px] mt-[50px] flex-grow">
                <h2 className="text-xl font-bold mb-2">{course.course_name}</h2>
                <p className="text-sm mb-1">
                  Course Category: {course.course_category}
                </p>
                <p className="text-sm">{course.description}</p>
              </div>
              {role && (
                <div className="flex items-center mt-[100px]">
                  <button
                    onClick={() => handleSubscribe(course._id)}
                    className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
        <nav className="mt-4" aria-label="Pagination">
          <ul className="flex justify-center">
            {Array.from({
              length: Math.ceil(courses.length / coursesPerPage),
            }).map((_, index) => (
              <li key={index}>
                <button
                  className="px-4 py-2 mx-1 bg-gray-200 rounded-md"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </SpinnerWrapper>
    </div>
  );
};

export default Course;
