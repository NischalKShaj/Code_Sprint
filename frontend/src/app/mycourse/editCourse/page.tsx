// file to edit the courses
"use client";

// importing the required modules
import React, { useState } from "react";
import { CourseState } from "@/app/store/courseStore";
import TutorSideBar from "@/components/partials/TutorSideBar";

const EditCoursePage = () => {
  const myCourse = CourseState((state) => state.myCourse);
  const [formData, setFormData] = useState({
    id: myCourse?.id || "",
    course_name: myCourse?.course_name || "",
    course_category: myCourse?.course_category || "",
    description: myCourse?.description || "",
    price: myCourse?.price || 0,
    video: myCourse?.videos || [],
  });
  return (
    <div className="flex justify-center min-h-screen mt-[70px] mb-[-300px]">
      <TutorSideBar />
      <section className="bg-[#D9D9D9] flex items-center justify-center p-8 h-full w-[570px] rounded-lg shadow-md">
        <form
          //   onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col items-center justify-center text-left w-full"
        >
          <input
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            type="text"
            name="course_name"
            required
            id="course_name"
            placeholder="Enter the course name"
            value={formData.course_name}
            // onChange={handleChange}
          />
          <input
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            type="text"
            name="course_category"
            required
            id="course_category"
            placeholder="Enter the course category"
            value={formData.course_category}
            // onChange={handleChange}
          />
          <textarea
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            name="description"
            required
            id="description"
            placeholder="Enter the description for the course"
            value={formData.description}
            // onChange={handleChange}
          />
          <input
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            type="number"
            name="amount"
            required
            id="amount"
            min={0}
            placeholder="Enter the price for the course"
            value={formData.price}
            // onChange={handleChange}
          />
          <label htmlFor="videos" className="text-gray-500 mr-[50px] mt-3">
            Select MP4 or WebM format
          </label>
          <input
            // onChange={videoChange}
            type="file"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            id="videos"
            name="courses"
            multiple
            accept="video/mp4,video/webm"
            required
          />
          <div className="flex justify-center space-x-4 w-full mt-7">
            <button
              className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-[250px]"
              type="submit"
            >
              Edit
            </button>
            <button
              className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-[250px]"
              type="button"
            >
              Delete
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditCoursePage;
