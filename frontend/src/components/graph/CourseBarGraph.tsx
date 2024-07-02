// file to show the total subscriber for each course
"use client";

// importing the required modules
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Course {
  course_name: string;
  totalSubscribed: number;
}

const CourseBarGraph = () => {
  const [courseData, setCourseData] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/graphs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          setCourseData(response.data.totalSubscribers);
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "start", width: "100%" }}>
      <h2>Total Subscribers per Course</h2>
      <div style={{ width: "100%", height: "400px", maxWidth: "100%" }}>
        <BarChart
          width={600}
          height={400}
          data={courseData}
          margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
        >
          <XAxis dataKey="course_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSubscribed" fill="#069686" />
        </BarChart>
      </div>
    </div>
  );
};

export default CourseBarGraph;
