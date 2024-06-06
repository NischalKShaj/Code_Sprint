// file to show the landing page for the user and the tutor
"use client";

// importing the required modules for the page
import Image from "next/image";
import { useEffect } from "react";
import { AppState } from "./store";

const Home = () => {
  const isLoggedOut = AppState((state) => state.isLoggedOut);
  useEffect(() => {
    setTimeout(() => {
      isLoggedOut();
      localStorage.removeItem("access_token");
    }, 4000000);
  }, []);

  return (
    <div>
      <section className="flex justify-center mt-7 mb-7 space-x-[370px]">
        <div className="items-center text-center text-3xl mt-9">
          <q>
            Code with determination,
            <br /> debug with patience,
            <br /> and celebrate every step forward.
            <br /> Keep going—greatness awaits <br />
            those who persist.
          </q>
        </div>
        <Image
          src="/image/landing.webp"
          alt="image for the landing page"
          width={550}
          height={550}
        />
      </section>
    </div>
  );
};

export default Home;
