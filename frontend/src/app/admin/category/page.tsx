// file to show all the categories in the admin side
"use client";

// importing the required modules
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
dotenv.config();

interface Category {
  category_name: string;
  _id: string;
}

const Category = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_access_token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/category`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 202) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("error", error);
        router.push("/admin/error");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <div className="flex-1 ml-[220px] flex justify-center mt-[25px]">
          {categories && categories.length > 0 ? (
            <div className="relative items-center justify-center overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-[1000px] items-center justify-items-center text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Index
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{category.category_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No category found</p>
          )}
        </div>
      </SpinnerWrapper>
    </div>
  );
};

export default Category;
