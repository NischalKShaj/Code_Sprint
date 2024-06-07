// file to create profile for the user and the tutor
"use client";

// importing the required modules
import axios from "axios";
import React, { useEffect } from "react";
import dotenv from "dotenv";
import { AppState } from "../store";
dotenv.config();

const Profile = () => {
  const user = AppState((state) => state.user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile/:${user}`
        );
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  });
  return (
    <div>
      <h3>profile</h3>
    </div>
  );
};

export default Profile;
