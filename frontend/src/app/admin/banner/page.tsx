// file for showing the banner
"use client";

// importing the required modules
import AdminSidePanel from "@/components/partials/AdminSidePanel";
import SpinnerWrapper from "@/components/partials/SpinnerWrapper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
import Image from "next/image";
dotenv.config();

interface Banner {
  _id: string;
  name: string;
  description: string;
  bannerImage: string;
}

const Banner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_access_token");
      try {
        const response = await axios.get<Banner[]>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/banner`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setBanners(response.data);
        }
      } catch (error) {
        console.error("error", error);
        router.push("/admin/error");
      }
    };
    fetchData();
  }, [router]);

  const handleEdit = (bannerId: string) => {
    router.push(`/admin/banner/${bannerId}`);
  };

  const handleDelete = (bannerId: string) => {
    console.log(`Deleting banner with ID: ${bannerId}`);
  };

  return (
    <div>
      <SpinnerWrapper>
        <AdminSidePanel />
        <div className="flex-1 ml-[220px] flex justify-center mt-[25px]">
          {banners && banners.length > 0 ? (
            <div className="relative items-center justify-center overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-[1000px] items-center justify-items-center text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4"></th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Banner Image
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr
                      key={banner._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 p-4"></td>
                      <td className="px-6 py-4">{banner.name}</td>
                      <td className="px-6 py-4">{banner.description}</td>
                      <td className="px-6 py-4">
                        <Image
                          width={150}
                          height={100}
                          src={banner.bannerImage}
                          alt={banner.name}
                          className="object-cover rounded-lg shadow-md"
                        />
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="font-bold py-2 px-4 rounded-xl bg-green-600 text-white"
                          onClick={() => handleEdit(banner._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="font-bold py-2 px-4 rounded-xl bg-red-600 text-white"
                          onClick={() => handleDelete(banner._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No banners found</p>
          )}
        </div>
      </SpinnerWrapper>
    </div>
  );
};

export default Banner;
