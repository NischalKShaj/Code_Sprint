"use client";

// Importing required modules
import axios from "axios";
import React, { useState } from "react";
import dotenv from "dotenv";
import { AppState } from "../../store";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

dotenv.config();

const AddCourse = () => {
  const email = AppState((state) => state.user?.email);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const [form, setForm] = useState({
    course_name: "",
    course_category: "",
    description: "",
    amount: "",
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
      formData.append("description", form.description);
      formData.append("amount", form.amount);

      for (const file of files) {
        formData.append("courses", file);
      }

      const entries = Array.from(formData.entries());
      entries.forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      const token = localStorage.getItem("access_token");

      Swal.fire({
        icon: "success",
        title: "Playlist Uploading in Progress",
        text: "Your playlist will be uploaded within a few minutes. Please check back later.",
        confirmButtonText: "OK",
      });
      router.push("/mycourse");

      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/uploads?userEmail=${encodeURIComponent(email)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("response", response.data);
      if (response.status !== 202) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error uploading files", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "There was an error processing your request. Please try again.",
        confirmButtonText: "Try Again",
      });
      router.push("/error");
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
      <section className="bg-[#D9D9D9] p-8 h-[520px] w-[370px] rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col items-center justify-center text-left"
        >
          <input
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            type="text"
            name="course_name"
            required
            id="course_name"
            placeholder="Enter the course name"
            onChange={handleChange}
          />
          <input
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            type="text"
            name="course_category"
            required
            id="course_category"
            placeholder="Enter the course category"
            onChange={handleChange}
          />
          <input
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            type="text"
            name="description"
            required
            id="description"
            placeholder="Enter the description for the course"
            onChange={handleChange}
          />
          <input
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            type="number"
            name="amount"
            required
            id="amount"
            min={0}
            placeholder="Enter the price for the course"
            onChange={handleChange}
          />
          <label htmlFor="videos" className="text-gray-500 mr-[50px]">
            Select MP4 or WebM format
          </label>
          <input
            onChange={videoChange}
            type="file"
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg  w-full mt-3"
            id="videos"
            name="courses"
            multiple
            accept="video/mp4,video/webm"
            required
          />
          <button
            className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl w-full mt-7"
            type="submit"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddCourse;
