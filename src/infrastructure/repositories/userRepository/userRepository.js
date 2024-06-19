// file for the user repository

// importing the modules required
const TemporaryUserCollection = require("../../../core/entities/temporary/temporaryUserCollection");
const UserCollection = require("../../../core/entities/user/userCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const bcryptjs = require("bcryptjs");
const CourseCollection = require("../../../core/entities/course/courseCollection");

// creating userRepository
const userRepository = {
  // method to get all the users
  getAllUser: async () => {
    const users = await UserCollection.find();
    console.log("users");
  },

  // method for login
  findUser: async (user) => {
    try {
      const userEmail = user.email;
      const userPassword = user.password;
      const userDetails = await UserCollection.findOne({ email: userEmail });
      const tutorDetails = await TutorCollection.findOne({ email: userEmail });

      // Check if the user details exists and validate password
      if (
        userDetails &&
        bcryptjs.compareSync(userPassword, userDetails.password) &&
        userDetails.blocked === false
      ) {
        return userDetails;
      }

      // Check if tutor details exist and validate password
      if (
        tutorDetails &&
        bcryptjs.compareSync(userPassword, tutorDetails.password) &&
        tutorDetails.blocked === false
      ) {
        return tutorDetails;
      }

      // If neither match, return null
      return null;
    } catch (error) {
      console.log("error");
      throw error;
    }
  },

  // method for signup
  createUser: async (userData) => {
    try {
      const userEmail = userData.email;
      const userDetails = await UserCollection.findOne({ email: userEmail });
      if (!userDetails) {
        const hashedPassword = bcryptjs.hashSync(userData.password, 10);
        let userDetail = new TemporaryUserCollection({
          username: userData.username,
          email: userEmail,
          phone: userData.phone,
          password: hashedPassword,
          otp: userData.otp,
        });
        await userDetail.save();
        console.log(userDetail);
        return userDetail;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // method to check whether the user valid or not
  validateUser: async (userOtp) => {
    try {
      // const userOtp = userData.otp;
      const userDetail = await TemporaryUserCollection.findOne({
        otp: userOtp,
      });
      if (userDetail) {
        let user = new UserCollection({
          username: userDetail.username,
          email: userDetail.email,
          phone: userDetail.phone,
          password: userDetail.password,
          otp: userOtp,
        });
        await user.save();
        console.log("user", user);

        // removing the user from the temporary collection
        await TemporaryUserCollection.deleteOne({ otp: userOtp });
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // method for otp resending
  resendOtp: async (userEmail, newOTP) => {
    try {
      const user = await TemporaryUserCollection.findOne({ email: userEmail });
      if (user) {
        await TemporaryUserCollection.updateOne(
          { email: userEmail },
          { otp: newOTP }
        );
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for adding the subscribed courses
  AddSubscription: async (course, user) => {
    try {
      const courseData = await CourseCollection.findById({ _id: course });
      console.log("course", courseData);
      const userData = await UserCollection.findById({ _id: user });
      console.log("user", userData);
      if (courseData && userData) {
        return { courseData, userData };
      }
    } catch (error) {
      throw error;
    }
  },

  // method for verifying the payment
  paymentSuccess: async (course, user) => {
    try {
      const courseData = await CourseCollection.findById({ _id: course });
      const userData = await UserCollection.findById({ _id: user });
      if (courseData && userData) {
        // for updating the user side to show the subscription
        const updatedUser = await UserCollection.findByIdAndUpdate(
          user,
          {
            $push: {
              courses: { courseId: courseData._id, tutorId: courseData.tutor },
            },
          },
          { new: true }
        );

        //for updating the tutor collection to show the subscribers list
        const updatedTutor = await TutorCollection.findByIdAndUpdate(
          {
            _id: courseData.tutor,
          },
          {
            $push: {
              subscribers: {
                userId: userData._id,
                courseId: courseData._id,
                subscriptionDate: Date.now(),
              },
            },
          },
          { new: true }
        );

        console.log("updatedUser", updatedUser);
        console.log("updated TUtor", updatedTutor);
        return updatedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for editing the user
  editStudent: async (userData, profileImage, userId) => {
    try {
      const user = {
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
      };

      if (profileImage) {
        console.log("profileImage", profileImage);
        user.profileImage = profileImage;
      }

      const userDetails = await UserCollection.findByIdAndUpdate(userId, user, {
        new: true,
      });
      console.log("userDetails", userDetails);
      if (userDetails) {
        return userDetails;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userRepository;
