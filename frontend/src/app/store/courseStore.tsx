// file to create the store for the course

// importing the required modules
import { create } from "zustand";

// creating the interface for the state
interface State {
  course: {
    course_name: string;
    description: string;
    course_category: string;
    videos: { url: string }[];
    number_of_tutorials: string;
    tutor_id: string;
    course_id: string;
  } | null;
  showCourse: (course: {
    course_name: string;
    description: string;
    course_category: string;
    videos: { url: string }[];
    number_of_tutorials: string;
    course_id: string;
    tutor_id: string;
  }) => void;
  allCourse: {
    _id: string;
    course_name: string;
    description: string;
    course_category: string;
    videos: string[];
  }[];
  findAllCourse: (
    allCourse: {
      _id: string;
      course_name: string;
      description: string;
      course_category: string;
      videos: string[];
    }[]
  ) => void;
}

// creating the store
export const CourseState = create<State>((set, get) => {
  let initialState = {
    course: null,
    allCourse: [],
  };
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("courseState");
    if (savedState) {
      try {
        initialState = JSON.parse(savedState);
      } catch (error) {
        console.error("Error parsing saving state:", error);
      }
    }
  }
  return {
    ...initialState,
    showCourse: (course) => {
      set({ course });
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "courseState",
          JSON.stringify({ ...get(), course })
        );
      }
    },
    findAllCourse(allCourse) {
      set({ allCourse });
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "courseState",
          JSON.stringify({ ...get(), allCourse })
        );
      }
    },
  };
});
