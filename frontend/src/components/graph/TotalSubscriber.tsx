// file to show the graph representing the total subscribers
"use client";

// importing the required modules
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart } from "@mui/x-charts";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { AppState } from "@/app/store";

interface SubscriberData {
  label: string;
  count: number;
}

const TotalSubscriber: React.FC = () => {
  const user = AppState((state) => state.user);
  const [monthlyData, setMonthlyData] = useState<SubscriberData[]>([]);
  const [yearlyData, setYearlyData] = useState<SubscriberData[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<
    "monthly" | "yearly"
  >("monthly");
  const [loading, setLoading] = useState(true);
  const id = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/graph/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 202) {
          const dataFromBackend = response.data;

          const transformedMonthlyData = countSubscribersByMonth(
            dataFromBackend.month
          );
          const transformedYearlyData = countSubscribersByYear(
            dataFromBackend.year
          );

          setMonthlyData(transformedMonthlyData);
          setYearlyData(transformedYearlyData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const countSubscribersByMonth = (monthlyData: any[]): SubscriberData[] => {
    const initialCounts: { [key: string]: number } = {
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
    };

    monthlyData.forEach((item) => {
      const monthLabel = `${item.month}/${item.year}`;
      if (initialCounts.hasOwnProperty(monthLabel)) {
        initialCounts[monthLabel] += item.count;
      }
    });

    return Object.keys(initialCounts).map((label) => ({
      label,
      count: initialCounts[label],
    }));
  };

  const countSubscribersByYear = (yearlyData: any[]): SubscriberData[] => {
    const initialCounts: { [key: string]: number } = {};

    yearlyData.forEach((item) => {
      const year = item.year.toString();
      if (!initialCounts.hasOwnProperty(year)) {
        initialCounts[year] = 0;
      }
      initialCounts[year] += item.count;
    });

    return Object.keys(initialCounts).map((year) => ({
      label: year,
      count: initialCounts[year],
    }));
  };

  const handleIntervalChange = (
    event: SelectChangeEvent<"monthly" | "yearly">
  ) => {
    setSelectedInterval(event.target.value as "monthly" | "yearly");
  };

  return (
    <div>
      <FormControl
        variant="outlined"
        style={{ marginBottom: "1rem", minWidth: 120 }}
      >
        <InputLabel id="interval-select-label">Interval</InputLabel>
        <Select
          labelId="interval-select-label"
          id="interval-select"
          value={selectedInterval}
          onChange={handleIntervalChange}
          label="Interval"
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>

      {!loading && (
        <BarChart
          data={selectedInterval === "monthly" ? monthlyData : yearlyData}
          xAxis={[
            {
              dataKey: "label",
              type: "category",
            },
          ]}
          series={[
            {
              dataKey: "count",
              type: "bar",
            },
          ]}
          height={400}
          width={600}
        />
      )}
    </div>
  );
};

export default TotalSubscriber;
