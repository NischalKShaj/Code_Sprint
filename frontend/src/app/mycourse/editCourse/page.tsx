"use client";

// importing the required modules
import React, { useState, useEffect, ChangeEvent } from "react";
import { CourseState } from "@/app/store/courseStore";
import TutorSideBar from "@/components/partials/TutorSideBar";
import axios from "axios";
import dotenv from "dotenv";
import Swal from "sweetalert2";
import { AppState } from "@/app/store";
import { useRouter } from "next/navigation";
dotenv.config();

const EditCoursePage = () => {
  const myCourse = CourseState((state) => state.myCourse);
  const router = useRouter();
  const setMyCourse = CourseState((state) => state.setMyCourse);
  const user = AppState((state) => state.user);
  const id = user?.id;
  const [formData, setFormData] = useState({
    id: myCourse?.id || "",
    course_name: myCourse?.course_name || "",
    course_category: myCourse?.course_category || "",
    description: myCourse?.description || "",
    price: myCourse?.price || 0,
    videos: myCourse?.videos || [],
  });

  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [newVideoPreviews, setNewVideoPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Load initial video previews from formData.videos
    if (formData.videos.length > 0) {
      setNewVideoPreviews(formData.videos);
    }
  }, [formData.videos]);

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setNewVideoPreviews(previews);
      setNewVideos(files);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("courseId", formData.id);
    data.append("course_name", formData.course_name);
    data.append("course_category", formData.course_category);
    data.append("description", formData.description);
    data.append("price", formData.price.toString());

    if (newVideos.length > 0) {
      newVideos.forEach((video) => {
        data.append("courses", video); // Field name should be 'courses'
      });
    }

    const token = localStorage.getItem("access_token");
    try {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Course update in progress. Refresh after a few minutes!",
        showConfirmButton: false,
        timer: 2500,
      });
      router.push(`/mycourse/${myCourse?.id}`);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/course/edit/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 202) {
        const modifiedVideos = response.data.videos.map((videoUrl: string) =>
          videoUrl.slice(0, -1)
        );

        setMyCourse({
          id: response.data._id,
          course_name: response.data.course_name,
          course_category: response.data.course_category,
          description: response.data.description,
          price: response.data.price,
          videos: modifiedVideos, // Update with new videos
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error while updating",
        showConfirmButton: false,
        timer: 1700,
      });
    }
  };

  // function to handle the delete operation for the courses
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      position: "center",
      icon: "warning",
      title: "Are you sure you want to delete",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      denyButtonText: "Cancel",

      customClass: {
        confirmButton: "btn-confirm",
        denyButton: "btn-deny",
      },
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/course/delete/${id}?userId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 204) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Course Deleted",
            text: "You have successfully deleted the course",
          });
          router.push("/mycourse");
        }
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen pt-4 pb-24 bg-gray-100">
      <TutorSideBar />
      <div className="flex flex-col items-center justify-center w-full">
        <section className="bg-[#D9D9D9] flex items-center justify-center p-8 h-auto w-[570px] rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex flex-col items-center justify-center text-left w-full"
          >
            <input
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
              type="text"
              name="course_name"
              id="course_name"
              placeholder="Enter the course name"
              value={formData.course_name}
              onChange={handleChange}
            />
            <input
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
              type="text"
              name="course_category"
              id="course_category"
              placeholder="Enter the course category"
              value={formData.course_category}
              onChange={handleChange}
            />
            <textarea
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
              name="description"
              id="description"
              placeholder="Enter the description for the course"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
              type="number"
              name="price"
              id="amount"
              min={0}
              placeholder="Enter the price for the course"
              value={formData.price}
              onChange={handleChange}
            />
            <label htmlFor="videos" className="text-gray-500 mr-[50px] mt-3">
              Select MP4 or WebM format
            </label>
            <input
              onChange={handleVideoChange}
              type="file"
              className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full mt-3"
              id="videos"
              name="courses"
              multiple
              accept="video/mp4,video/webm"
            />
            <div className="flex flex-wrap space-x-2 mt-4">
              {newVideoPreviews.map((videoUrl, index) => (
                <video
                  key={index}
                  className="w-[150px] h-[100px] mb-4 rounded-lg"
                  controls
                >
                  <source src={videoUrl} type="video/mp4" />
                  <source src={videoUrl} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
            <div className="flex justify-center space-x-4 w-full mt-7">
              <button
                className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-[250px]"
                type="submit"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(formData.id)}
                className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-[250px]"
                type="button"
              >
                Delete
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default EditCoursePage;
