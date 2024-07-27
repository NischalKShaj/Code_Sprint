// file for the user repository

// importing the modules required
const TemporaryUserCollection = require("../../../core/entities/temporary/temporaryUserCollection");
const UserCollection = require("../../../core/entities/user/userCollection");
const TutorCollection = require("../../../core/entities/user/tutorCollection");
const bcryptjs = require("bcryptjs");
const CourseCollection = require("../../../core/entities/course/courseCollection");
const BannerCollection = require("../../../core/entities/banner/bannerCollection");
const PayoutCollection = require("../../../core/entities/paymentRequest/paymentRequest");
const ProblemCollection = require("../../../core/entities/problems/problemCollection");
const PaymentCollection = require("../../../core/entities/payment/paymentCollection");
const mongoose = require("mongoose");

// creating userRepository
const userRepository = {
  // method to get all the users
  getHome: async () => {
    try {
      const banners = await BannerCollection.find();
      if (banners) {
        return banners;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
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
        const updatedUser = await UserCollection.findByIdAndUpdate(
          { _id: userDetails._id },
          { isOnline: true },
          { new: true }
        );
        return updatedUser;
      }

      // Check if tutor details exist and validate password
      if (
        tutorDetails &&
        bcryptjs.compareSync(userPassword, tutorDetails.password) &&
        tutorDetails.blocked === false
      ) {
        const updatedTutor = await TutorCollection.findByIdAndUpdate(
          { _id: tutorDetails._id },
          { isOnline: true },
          { new: true } // Ensure to return the new document and run schema validators
        );
        return updatedTutor;
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
          interests: userData.interests,
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
          interests: userDetail.interests,
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
      const courseData = await CourseCollection.findByIdAndUpdate(
        { _id: course },
        { $inc: { totalSubscribed: 1 } },
        { new: true }
      );
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
            $inc: {
              wallet: courseData.price,
            },
          },
          { new: true }
        );

        // for updating the payment history for the student
        const paymentHistory = new PaymentCollection({
          amount: courseData.price,
          userId: user,
          paymentTo: courseData.tutor,
          paymentFor: courseData.course_name,
          createdAt: Date.now(),
          status: "paid",
        });

        await paymentHistory.save();
        console.log("payment history", paymentHistory);

        // for updating the payout amount
        const payoutData = await PayoutCollection.findOne({
          tutor: courseData.tutor.toString(),
        });

        if (payoutData) {
          const updatedPayoutData = await PayoutCollection.findByIdAndUpdate(
            { _id: payoutData._id },
            { $inc: { wallet: courseData.price }, status: true },
            { new: true }
          );

          console.log("payoutData", updatedPayoutData);
        }

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

  // method for unsubscribing the course
  unSubscribe: async (courseId, userId) => {
    try {
      const course = await CourseCollection.findById({ _id: courseId });
      const user = await UserCollection.findById({ _id: userId });
      if (course && user) {
        // for removing the subscribed course from the user side
        const updatedUser = await UserCollection.findByIdAndUpdate(
          user,
          {
            $pull: { courses: { courseId: course._id, tutorId: course.tutor } },
          },
          { new: true }
        );
        console.log("updated", updatedUser);

        // for removing the subscribed user from the tutor
        const updatedTutor = await TutorCollection.findByIdAndUpdate(
          {
            _id: course.tutor,
          },
          {
            $pull: {
              subscribers: {
                userId: user._id,
                courseId: course._id,
              },
            },
          },
          { new: true }
        );

        // for reducing the subscribers count from the course
        const courseData = await CourseCollection.findByIdAndUpdate(
          { _id: courseId },
          { $inc: { totalSubscribed: -1 } },
          { new: true }
        );
        return user;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for adding the problem after submission
  addProblem: async (id, userId, dailyChallenge) => {
    try {
      const user = await UserCollection.findById({ _id: userId });

      const problem = await ProblemCollection.findById({ _id: id });

      if (user) {
        const problemExist = user.problems.includes(id);

        if (dailyChallenge) {
          const dailyProblemEntry = {
            problemId: id,
            date: new Date(),
          };
          console.log("daily problem entry", dailyProblemEntry);
          // saving the daily problem
          user.dailyProblems.push(dailyProblemEntry);
          // updating the streak
          user.streak += 1;
          await user.save();
        }

        console.log("user daily problems", user);

        if (!problemExist) {
          user.problems.push(id);
          problem.count += 1;
          try {
            // Save the updated problem and user documents
            await problem.save();
            await user.save();
          } catch (error) {
            throw error;
          }
          return user;
        } else {
          return user;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for getting all the tutors for the specific user
  getAllTutors: async (id) => {
    try {
      const user = await UserCollection.findById({ _id: id });
      if (!user) {
        return null;
      }

      // extracting the tutors id from the users collection
      const tutorsIds = user.courses.map((tutor) => tutor.tutorId.toString());
      if (!tutorsIds) {
        return null;
      }

      // extracting the tutor form the tutors collection
      const tutors = await TutorCollection.find(
        { _id: { $in: tutorsIds } },
        { _id: 1, username: 1, profileImage: 1, isOnline: 1 }
      );
      console.log("tutors", tutors);
      if (tutors) {
        return tutors;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for logging out the user
  logoutUser: async (id) => {
    try {
      const user = await UserCollection.findById(id);
      if (user) {
        // Update user's isOnline status
        const updatedUser = await UserCollection.findByIdAndUpdate(
          id,
          { isOnline: false },
          { new: true }
        );
        return updatedUser;
      }

      // Check if the id belongs to a tutor
      const tutor = await TutorCollection.findById(id);
      if (tutor) {
        // Update tutor's isOnline status
        const updatedTutor = await TutorCollection.findByIdAndUpdate(
          id,
          { isOnline: false },
          { new: true }
        );
        return updatedTutor;
      }

      // If the id is not found in both collections, return null
      return null;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userRepository;
