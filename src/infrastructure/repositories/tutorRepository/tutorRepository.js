// file for creating the repository for the tutor

// importing the required modules
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const TemporaryTutorCollection = require("../../../core/entities/temporary/temporaryTutorCollection");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const bcryptjs = require("bcryptjs");

// creating tutor repository
const tutorRepository = {
  // method for finding the tutor
  findTutor: async (tutorData) => {
    try {
      const tutorEmail = tutorData.email;
      const tutorPassword = tutorData.password;
      const tutorDetails = await TutorCollection.findOne({ email: tutorEmail });
      const validPassword = bcryptjs.compareSync(
        tutorPassword,
        tutorDetails.password
      );
      console.log("tutorDetails", tutorDetails);
      console.log("validPassword", validPassword);
      if (tutorEmail === tutorDetails.email && validPassword) {
        return tutorDetails;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error", error);
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
  addCourses: async (course, courses, userData) => {
    try {
      const tutor = await TutorCollection.findOne({ email: userData });
      if (tutor) {
        const videoDetails = courses.map((course) => ({
          url: course.location,
          key: course.key,
          originalname: course.originalname,
        }));
        const url = videoDetails.map((video) => video.url);
        const courseData = new CourseCollection({
          course_name: course.course_name,
          course_category: course.course_category,
          number_of_videos: courses.length.toString(),
          description: course.description,
          tutor: tutor._id,
          videos: url,
        });

        const course_Data = {
          title: course.course_name,
          description: course.description,
          category: course.course_category,
          url: url,
        };
        await TutorCollection.updateOne(
          { _id: tutor._id },
          { $push: { course: course_Data } }
        );
        await courseData.save();
        console.log("courseData", courseData);
        return courseData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("error", error);
    }
  },
};

module.exports = tutorRepository;