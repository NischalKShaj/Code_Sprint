// admin header

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AppState } from "@/app/store";
import dotenv from "dotenv";
import { usePathname, useRouter } from "next/navigation";
dotenv.config();

const AdminHeader = () => {
  const admin = AppState((state) => state.isAdmin);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // make it a skeleton
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="bg-[#F0E6E6] flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin">
            <Image
              src="/image/test-removebg-preview.png"
              width={250}
              height={250}
              alt="logo"
            />
          </Link>
        </div>
        {pathname === "/admin/banner" && (
          <div className="flex items-center mr-[100px]">
            <Link href="/admin/banner/addBanner">
              <button className="bg-[#686DE0] text-white font-bold py-2 px-4 rounded-xl relative">
                add banner
              </button>
            </Link>
          </div>
        )}
      </header>
    </>
  );
};

export default AdminHeader;
