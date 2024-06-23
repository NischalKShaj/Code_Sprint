// file to show the landing page for the user and the tutor
"use client";

// importing the required modules for the page
import Image from "next/image";
import { useEffect } from "react";
import { AppState } from "./store";
import UserBanner from "@/components/partials/UserBanner";

const Home = () => {
  const isLoggedOut = AppState((state) => state.isLoggedOut);
  const user = AppState((state) => state.user);
  useEffect(() => {
    setTimeout(() => {
      isLoggedOut();
      localStorage.removeItem("access_token");
    }, 4000000);
  }, [isLoggedOut]);

  return (
    <div>
      {user?.role === "tutor" ? (
        <section className="flex justify-center mt-7 mb-7 space-x-10">
          <div>
            <div className="flex items-center space-x-[300px] text-left">
              <q className="text-3xl mt-9">
                Welcome, tutor!
                <br /> Share your knowledge,
                <br /> inspire your students,
                <br /> and empower the next generation.
                <br /> Let`s make learning impactful.
              </q>
              <Image
                src="/image/landing.webp"
                alt="image for the landing page"
                width={550}
                height={550}
              />
            </div>
            <hr className="w-full h-4 mx-auto my-4 bg-gray-300 border-0 mt-4 rounded md:my-10 dark:bg-gray-700" />
            <div>
              <h2 className="text-3xl mt-6 mb-4 text-center">
                Instructions to Add a New Course
              </h2>
              <hr className="w-20 h-1 mx-auto my-4 bg-black border-0 mt-2 rounded md:my-6 dark:bg-gray-700" />
              <ul className="list-disc pl-6">
                <li>
                  <strong>Step 1:</strong> Navigate to the header and click on
                  <q>Add Course</q>. This action will initiate the course
                  creation process.
                </li>
                <li className="mt-4">
                  <strong>Step 2:</strong> Inside the <q>Add Course</q>
                  section, fill out the course form with the following details:
                  <ul className="list-disc pl-6 mt-2">
                    <li>a. Name of the course</li>
                    <li>b. Category of the course</li>
                    <li>c. Description of the course</li>
                    <li>d. Price of the course</li>
                    <li>e. Select the videos for the playlist</li>
                  </ul>
                  After filling out these details, your course will be added to
                  the <q>My Course</q> section.
                </li>
                <li className="mt-4">
                  <strong>Step 3:</strong> After a few minutes, your course will
                  be visible in the <q>My Course</q> section.
                </li>
              </ul>
            </div>
            <hr className="w-full h-4 mx-auto my-4 bg-gray-300 border-0 mt-4 rounded md:my-10 dark:bg-gray-700" />
            <div>
              <h2 className="text-3xl mt-6 mb-4 text-center">
                Instructions to Edit a Course
              </h2>
              <hr className="w-20 h-1 mx-auto my-4 bg-black border-0 mt-2 rounded md:my-6 dark:bg-gray-700" />
              <ul className="list-disc pl-6">
                <li>
                  <strong>Step 1:</strong> Navigate to the header and click on
                  <q>My Course</q>. This action will navigate you to the list of
                  courses you have added.
                </li>
                <li className="mt-4">
                  <strong>Step 2:</strong> Inside the <q>My Course</q>
                  section, find the course you want to edit and click on the
                  <q>Show</q> button.
                </li>
                <li className="mt-4">
                  <strong>Step 3:</strong> On the <q>Course</q> page, click on
                  the <q>Edit Course</q> button. Update the following details in
                  the form:
                  <ul className="list-disc pl-6 mt-2">
                    <li>a. Name of the course</li>
                    <li>b. Category of the course</li>
                    <li>c. Description of the course</li>
                    <li>d. Price of the course</li>
                    <li>e. Select the videos for the playlist</li>
                  </ul>
                  After updating these details, your course will be edited and
                  saved in the <q>My Course</q> section.
                </li>
                <li className="mt-4">
                  <strong>Step 4:</strong> After a few minutes, the edited
                  course details will be visible in the <q>My Course</q>
                  section.
                </li>
              </ul>
            </div>
            <hr className="w-full h-4 mx-auto my-4 bg-gray-300 border-0 mt-4 rounded md:my-10 dark:bg-gray-700" />
            <p className="text-center mt-8 text-lg">
              Thank you for contributing to our learning community! If you have
              any questions or need further assistance, feel free to contact our
              support team.
            </p>
          </div>
        </section>
      ) : (
        <div>
          <UserBanner />
        </div>
      )}
    </div>
  );
};

export default Home;
