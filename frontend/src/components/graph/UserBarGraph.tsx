"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
dotenv.config();

const UserBarGraph = () => {
  const router = useRouter();
  const [monthlyUserCounts, setMonthlyUserCounts] = useState<number[]>([]);
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
          const userGraphs: string[] = response.data.userGraphs || [];
          const newCounts = countUsersByMonth(userGraphs);
          setCounts(newCounts);
          setMonthlyUserCounts(Object.values(newCounts));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/error");
      }
    };

    if (token) {
      fetchData();
    }
  }, [router]);

  // Function to count users by month
  const countUsersByMonth = (userDates: string[]) => {
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
    } as { [key: string]: number }; // Type assertion for initialCounts

    userDates.forEach((dateString) => {
      const date = new Date(dateString);
      const month = date.toLocaleString("default", { month: "long" });

      if (initialCounts.hasOwnProperty(month)) {
        initialCounts[month]++;
      }
    });

    return initialCounts;
  };

  const xAxisLabels = Object.keys(counts); // Define xAxisLabels here based on counts

  return (
    <div style={{ textAlign: "start", width: "100%" }}>
      <h2>User Chart</h2>
      <div style={{ width: "100%", height: "400px", maxWidth: "100%" }}>
        <BarChart
          series={[{ data: monthlyUserCounts }]}
          height={290}
          xAxis={[{ data: xAxisLabels, scaleType: "band" }]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
      </div>
    </div>
  );
};

export default UserBarGraph;
