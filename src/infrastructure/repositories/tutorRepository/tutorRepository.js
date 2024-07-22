// file for creating the repository for the tutor

// importing the required modules
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const TemporaryTutorCollection = require("../../../core/entities/temporary/temporaryTutorCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const UserCollection = require("../../../core/entities/user/userCollection");
const bcryptjs = require("bcryptjs");
const encrypt = require("../../../adapters/middleware/videoAuth");

// creating tutor repository
const tutorRepository = {
  // method for finding the tutor
  findTutor: async (tutorData) => {
    try {
      const { email, password } = tutorData;

      // Find the tutor by email
      const tutorDetails = await TutorCollection.findOne({ email });

      // Check if tutorDetails exists and compare password
      if (
        tutorDetails &&
        bcryptjs.compareSync(password, tutorDetails.password)
      ) {
        // Update isOnline field to true
        const updatedTutor = await TutorCollection.findByIdAndUpdate(
          tutorDetails._id,
          { isOnline: true },
          { new: true, runValidators: true } // Ensure to return the new document and run schema validators
        );

        console.log("Updated Tutor:", updatedTutor);
        return updatedTutor;
      } else {
        console.log("Invalid email or password");
        return null;
      }
    } catch (error) {
      console.error("Error in findTutor:", error);
      throw error;
    }
  },

  // method for signup
  createTutor: async (tutorData) => {
    try {
      const tutorEmail = tutorData.email;
      const existingTutor = await TutorCollection.findOne({
        email: tutorEmail,
      });
      if (!existingTutor) {
        const hashedPassword = bcryptjs.hashSync(tutorData.password, 10);
        const newTutor = new TemporaryTutorCollection({
          username: tutorData.username,
          email: tutorData.email,
          password: hashedPassword,
          phone: tutorData.phone,
          otp: tutorData.otp,
        });
        await newTutor.save();
        console.log(newTutor);
        return newTutor;
      }
    } catch (error) {
      console.log("error while signup the tutor", error);
      throw error;
    }
  },

  // method for validating the tutor's otp
  validateOtp: async (userOtp) => {
    try {
      const tutor = await TemporaryTutorCollection.findOne({ otp: userOtp });
      if (tutor) {
        const tutorDetail = new TutorCollection({
          username: tutor.username,
          email: tutor.email,
          password: tutor.password,
          phone: tutor.phone,
          otp: tutor.otp,
        });
        await tutorDetail.save();
        await TemporaryTutorCollection.deleteOne({ otp: userOtp });
        return tutorDetail;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // method for adding the courses to the database according to the tutor
  addCourses: async (course, chapters, userData) => {
    try {
      // Find the tutor by email
      const tutor = await TutorCollection.findOne({ email: userData });
      if (!tutor) {
        return { success: false, data: "Tutor not found" };
      }

      // Prepare chapters with videos and chapter names
      const chaptersWithVideos = chapters.map((chapter) => ({
        chapterName: chapter.chapter_name,
        videos: chapter.videos.map((video) => {
          const encryptedVideo = encrypt.encrypt(video);
          console.log("Encrypted video:", encryptedVideo); // Check encrypted video before adding
          return encryptedVideo;
        }),
      }));

      // Validate chaptersWithVideos to ensure chapterName is populated
      for (const chapter of chaptersWithVideos) {
        if (!chapter.chapterName) {
          return { success: false, data: "Chapter name is required" };
        }
      }

      // Prepare course data
      const courseData = new CourseCollection({
        course_name: course.course_name,
        course_category: course.course_category,
        description: course.description,
        chapters: chaptersWithVideos.map((chapter, index) => ({
          chapterName: chapter.chapterName,
          videos: chapter.videos, // Ensure videos are encrypted here
        })),
        tutor: tutor._id,
        price: course.amount,
      });

      // Save course data
      const savedCourseData = await courseData.save();
      console.log("Saved course data:", savedCourseData);

      // Prepare module schema data for tutor
      const courseModule = {
        courseId: savedCourseData._id,
        title: savedCourseData.course_name,
        description: savedCourseData.description,
        category: savedCourseData.course_category,
        chapters: chaptersWithVideos.map((chapter, index) => ({
          chapterName: chapter.chapterName,
          videos: chapter.videos, // Ensure videos are encrypted here
        })),
      };

      // Update tutor's course collection
      await TutorCollection.updateOne(
        { _id: tutor._id },
        { $push: { course: courseModule } }
      );

      // Log and verify the updated tutor's courses
      const updatedTutor = await TutorCollection.findById(tutor._id).populate(
        "course.courseId"
      );
      console.log("Updated tutor courses:", updatedTutor.course);

      return { success: true, data: savedCourseData };
    } catch (error) {
      console.error("Error adding courses:", error);
      return { success: false, data: "Internal server error" };
    }
  },

  // method for getting all the subscribers
  getAllUsers: async (id) => {
    try {
      const tutor = await TutorCollection.findById({ _id: id });
      if (!tutor) {
        return null;
      }
      console.log("tutor", tutor);
      // extracting the subscribers id
      const subscribersId = tutor.subscribers.map((subscriber) =>
        subscriber.userId.toString()
      );

      console.log("subscribers id", subscribersId);

      // fetching the subscriber data
      const subscribers = await UserCollection.find(
        {
          _id: { $in: subscribersId },
        },
        { _id: 1, username: 1, profileImage: 1, isOnline: 1 }
      );

      console.log("subscribers", subscribers);
      if (subscribers) {
        return subscribers;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = tutorRepository;
