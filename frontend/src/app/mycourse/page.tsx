"use client";
import axios from "axios";
import React, { useState } from "react";
import dotenv from "dotenv";
dotenv.config();

const MyCourse = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (files.length === 0) {
        alert("Select at least one video");
        return;
      }
      if (files.length > 5) {
        alert("Select a maximum of 5 videos");
        return;
      }
      const formData = new FormData();
      for (const file of files) {
        formData.append("courses", file);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/uploads`,
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

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col items-center justify-center text-left"
      >
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
    </div>
  );
};

export default MyCourse;
