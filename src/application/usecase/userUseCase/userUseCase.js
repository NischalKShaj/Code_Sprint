// file for showcasing the users use-cases

// importing the required modules
const userRepository = require("../../../infrastructure/repositories/userRepository/userRepository");
const generateJWT = require("../../../infrastructure/services/jwtServices");
const Razorpay = require("razorpay");

// creating the user use-case
const userUseCase = {
  //creating the user
  getHome: async () => {
    try {
      const response = await userRepository.getHome();
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // for login purpose
  findUser: async (user) => {
    try {
      const result = await userRepository.findUser(user);
      console.log("result", result);
      if (result) {
        const token = generateJWT.generateJWT(result.email);
        return { success: true, data: result, token };
      } else {
        return { success: false, data: "invalid credentials" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for creating new user
  userSignup: async (userData) => {
    try {
      const newUser = await userRepository.createUser(userData);
      console.log("userUseCase", newUser);
      if (newUser) {
        return { success: true, data: newUser };
      } else {
        return { success: false, data: "user with same email exists" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for validating the user
  validateUser: async (userOtp) => {
    try {
      const newUser = await userRepository.validateUser(userOtp);
      if (newUser) {
        return { success: true, data: newUser };
      } else {
        return { success: false, data: "user not found" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // for otp resending
  resendOtp: async (userEmail, newOTP) => {
    try {
      const user = await userRepository.resendOtp(userEmail, newOTP);
      if (user) {
        return { success: true, data: user };
      } else {
        return { success: false, data: "otp resending failed" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // for managing the subscription for courses
  verifyPayment: async (amount, course, user) => {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Configuration options for creating an order
    const options = {
      amount: parseInt(amount, 10) * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    try {
      const order = await razorpay.orders.create(options);
      const data = await userRepository.AddSubscription(course, user);
      if (data) {
        return { success: true, data: course, data, order };
      } else {
        return { success: false, data: "invalid details" };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // for verifying the payment
  paymentSuccess: async (course, user) => {
    try {
      const result = await userRepository.paymentSuccess(course, user);
      console.log("result", result);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // for editing the user profile
  editStudent: async (userData, profileImage, userId) => {
    try {
      const result = await userRepository.editStudent(
        userData,
        profileImage,
        userId
      );
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for unsubscribing the course
  unSubscribe: async (courseId, userId) => {
    try {
      const result = await userRepository.unSubscribe(courseId, userId);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for getting all the tutors
  getAllTutors: async (id) => {
    try {
      const result = await userRepository.getAllTutors(id);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for user logging out
  logoutUser: async (id) => {
    try {
      const result = await userRepository.logoutUser(id);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },
};

module.exports = userUseCase;
