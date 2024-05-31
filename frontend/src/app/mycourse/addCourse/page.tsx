// file for adding the courses
"use client";
import axios from "axios";
import React, { useState } from "react";
import dotenv from "dotenv";
import { AppState } from "../../store";
dotenv.config();

const AddCourse = () => {
  const email = AppState((state) => state.user?.email);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    course_name: "",
    course_category: "",
    number_of_videos: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email) {
        alert("User email is not available. Please log in.");
        return;
      }
      if (files.length === 0) {
        alert("Select at least one video");
        return;
      }
      if (files.length > 5) {
        alert("Select a maximum of 5 videos");
        return;
      }
      const formData = new FormData();
      // Append form data fields to the FormData object
      formData.append("course_name", form.course_name);
      formData.append("course_category", form.course_category);
      formData.append("number_of_videos", form.number_of_videos);

      for (const file of files) {
        formData.append("courses", file);
      }

      const entries = Array.from(formData.entries());
      entries.forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/uploads?userEmail=${encodeURIComponent(email)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("response", response.data);
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };

  const videoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fileList = e.target.files;
    if (fileList !== null) {
      setFiles(Array.from(fileList));
    } else {
      setFiles([]);
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center mb-24 bg-white mt-16">
      <h3 className="text-2xl font-bold mb-6 text-center items-center">
        Add New Course
      </h3>
      <section className="bg-[#D9D9D9] p-8 h-[530px] w-[370px] rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col items-center justify-center text-left"
        >
          <label htmlFor="course_name">course name</label>
          <input
            type="text"
            name="course_name"
            required
            id="course_name"
            onChange={handleChange}
          />
          <label htmlFor="course_category">course category</label>
          <input
            type="text"
            name="course_category"
            required
            id="course_category"
            onChange={handleChange}
          />
          <label htmlFor="number_of_videos">number of videos</label>
          <input
            type="text"
            name="number_of_videos"
            required
            id="number_of_videos"
            onChange={handleChange}
          />
          <label htmlFor="video">Select a Video:</label>
          <input
            onChange={videoChange}
            type="file"
            id="video"
            name="courses"
            multiple
            accept="video/*"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default AddCourse;
