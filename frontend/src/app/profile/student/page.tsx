// file to create profile for the user and the tutor
"use client";

// importing the required modules
import axios from "axios";
import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import { AppState } from "../../store";
import { useRouter } from "next/navigation";
dotenv.config();

const Profile = () => {
  const user = AppState((state) => state.user);
  const [profile, setProfile] = useState({});
  const router = useRouter();

  useEffect(() => {
    const id = user?.id;
    const token = localStorage.getItem("access_token");
    console.log(token);
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile/user/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          // area to set the profile details after the completion of the subscription and the google works
          // setProfile({
          //   id: response.data._id,
          //   username: response.data.username,
          //   profileImage: response.data.profileImage,
          //   role: response.data.role,
          // });
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
      <h3>profile</h3>
    </div>
  );
};

export default Profile;
