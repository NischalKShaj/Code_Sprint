// file to show the tutor bar graph
"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
// importing the required modules
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TutorBarGraph = () => {
  const router = useRouter();
  const [monthlyTutorCounts, setMonthlyTutorCounts] = useState<number[]>([]);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  });
  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");

    const fetchData = async () => {
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
          const tutorGraphs: string[] = response.data.tutorGraphs || [];
          const newCounts = countTutorsByMonth(tutorGraphs);
          setCounts(newCounts);
          setMonthlyTutorCounts(Object.values(newCounts));
        }
      } catch (error) {
        console.error("error", error);
        router.push("/error");
      }
    };
    if (token) {
      fetchData();
    }
  }, [router]);

  // function to count users by month
  const countTutorsByMonth = (tutorDates: string[]) => {
    const initialCounts = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    } as { [key: string]: number };

    tutorDates.forEach((dateString) => {
      const date = new Date(dateString);
      const month = date.toLocaleString("default", { month: "long" });
      if (initialCounts.hasOwnProperty(month)) {
        initialCounts[month]++;
      }
    });
    return initialCounts;
  };

  const xAxisLabels = Object.keys(counts);

  return (
    <div style={{ textAlign: "start", width: "100%" }}>
      <h2>Tutor Chart</h2>
      <div style={{ width: "100%", height: "400px", maxWidth: "100%" }}>
        <BarChart
          series={[{ data: monthlyTutorCounts }]}
          height={290}
          xAxis={[{ data: xAxisLabels, scaleType: "band" }]}
          margin={{ top: 10, bottom: 30, left: 50, right: 10 }}
        />
      </div>
    </div>
  );
};

export default TutorBarGraph;
