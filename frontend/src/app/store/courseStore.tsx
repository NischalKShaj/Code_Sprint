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
    price: string;
  } | null;
  showCourse: (course: {
    course_name: string;
    description: string;
    course_category: string;
    videos: { url: string }[];
    number_of_tutorials: string;
    course_id: string;
    tutor_id: string;
    price: string;
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
  isSubscribed: {
    user_id: string | undefined;
    username: string | undefined;
    course_name: string | undefined;
    course_category: string | undefined;
    description: string | undefined;
    tutor_id: string;
    course_id: string;
  }[];
  subscribe: (
    isSubscribed: {
      user_id: string | undefined;
      username: string | undefined;
      course_name: string | undefined;
      course_category: string | undefined;
      description: string | undefined;
      tutor_id: string;
      course_id: string;
    }[]
  ) => void;
  completedVideos: Record<string, Record<string, boolean>>;
  toggleVideoCompletion: (courseId: string, videoUrl: string) => void;
}

// creating the store
export const CourseState = create<State>((set, get) => {
  let initialState = {
    course: null,
    allCourse: [],
    isSubscribed: [],
    completedVideos: {},
  };
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("courseState");
    if (savedState) {
      try {
        initialState = JSON.parse(savedState);
      } catch (error) {
        console.error("Error parsing saved state:", error);
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
    subscribe(isSubscribed) {
      set({ isSubscribed });
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "courseState",
          JSON.stringify({ ...get(), isSubscribed })
        );
      }
    },
    toggleVideoCompletion(courseId, videoUrl) {
      const { completedVideos } = get();
      console.log("completedVideos:", completedVideos); // Log completedVideos
      console.log("courseId:", courseId); // Log courseId

      // Initialize completedVideos as an empty object if it's undefined
      const currentCompletedVideos = completedVideos || {};

      // Access courseCompletion from currentCompletedVideos
      const courseCompletion = currentCompletedVideos[courseId] || {};
      courseCompletion[videoUrl] = !courseCompletion[videoUrl];

      set({
        // Update completedVideos with courseId and updated courseCompletion
        completedVideos: {
          ...currentCompletedVideos,
          [courseId]: courseCompletion,
        },
      });

      // Update localStorage with the updated state
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "courseState",
          JSON.stringify({
            ...get(),
            completedVideos: {
              ...currentCompletedVideos,
              [courseId]: courseCompletion,
            },
          })
        );
      }
    },
  };
});
