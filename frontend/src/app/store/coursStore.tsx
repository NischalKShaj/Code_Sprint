// file to create the store for the course

// importing the required modules
import { create } from "zustand";

// creating the interface for the state
interface State {
  course: {
    course_name: string;
    description: string;
    course_category: string;
    videos: string[];
    _id: string;
    isSubscribed: boolean;
  };
  showCourse: (course: {
    course_name: string;
    description: string;
    course_category: string;
    videos: string[];
    _id: string;
    isSubscribed: boolean;
  }) => void;
}
