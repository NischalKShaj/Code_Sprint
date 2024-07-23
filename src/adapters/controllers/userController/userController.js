// file for the users controller
const userUseCase = require("../../../application/usecase/userUseCase/userUseCase");
const tutorUseCase = require("../../../application/usecase/tutorUseCase/tutorUseCase");
const EmailService = require("../../../infrastructure/services/mailer");
const Razorpay = require("razorpay");

// function to generate otp
const generateOTP = () => {
  console.log("inside the function");
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// creating the controller for the user
const userController = {
  // creating the controller for the initial landing page
  getHome: async (req, res) => {
    try {
      const response = await userUseCase.getHome();
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(response.data);
    }
  },

  //controller for getting the login page
  getLogin: async (req, res) => {
    const user = req.body;
    console.log("user", user);
    try {
      const details = await userUseCase.findUser(user);
      console.log("details", details);
      if (details.success) {
        res
          .cookie("access_token", details.token, { httpOnly: true })
          .status(202)
          .json({ data: details.data, token: details.token });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for getting the signup page
  postSignup: async (req, res) => {
    try {
      const role = req.body.role;
      const userData = req.body;
      console.log("userData B4", userData);

      const otp = generateOTP();
      userData.otp = otp;
      console.log("otp", userData.otp);

      let result;
      if (role === "student") {
        result = await userUseCase.userSignup(userData);
      } else if (role === "tutor") {
        result = await tutorUseCase.tutorSignup(userData);
      }

      const emailService = new EmailService();
      emailService.sendOtpEmail(userData.email, otp);

      console.log("controller", result);
      if (result.success) {
        res.status(201).json({ ...result.data, otp });
      } else {
        res.status(409).json(result.data);
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  },

  // signing the user/tutor after validating the correct otp
  validateOtp: async (req, res) => {
    try {
      const otp = req.body;
      console.log("otp", otp);

      const userOtp = Object.entries(otp)
        .filter(([key]) => key.startsWith("otp"))
        .map(([_, value]) => value)
        .join("");
      console.log("userOtp", userOtp);

      const role = otp.selectedRole;

      let result;
      if (role === "student") {
        result = await userUseCase.validateUser(userOtp);
      } else if (role === "tutor") {
        result = await tutorUseCase.validateOtp(userOtp);
      }

      if (result.success) {
        res.status(201).json("user signed successfully");
      } else {
        res.status(400).json("invalid otp");
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  },

  // controller for otp resend
  resendOtp: async (req, res) => {
    try {
      const email = req.body.email;
      // regenerate the new otp
      const newOTP = generateOTP();

      const emailService = new EmailService();
      emailService.sendOtpEmail(email, newOTP);
      console.log("new otp", newOTP);
      const response = await userUseCase.resendOtp(email, newOTP);
      if (response.success) {
        res.status(201).json("otp resending success");
      } else {
        res.status(400).json("invalid user");
      }
    } catch (error) {
      console.error("error", error);
      res.status(500).json(response.data);
    }
  },

  // controller for validating the payment
  handler: async (req, res) => {
    if (req.method === "POST") {
      try {
        const { amount, user, course } = req.body;
        const response = await userUseCase.verifyPayment(amount, course, user);
        if (response.success) {
          res.status(200).json(response.data);
        } else {
          res.status(400).json(response.data);
        }
      } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
      }
    } else {
      // Respond with Method Not Allowed for non-POST requests
      res.status(405).json({ error: "Method not allowed" });
    }
  },

  // controller for payment verification
  verifyPayment: async (req, res) => {
    try {
      const { course, user } = req.body;
      const response = await userUseCase.paymentSuccess(course, user);
      console.log("response", response);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for editing the student details
  editStudent: async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const profileImage = req.file
        ? `http://localhost:4000/uploads/image/${req.file.filename}`
        : null;

      console.log("Updating user with ID:", userId);
      console.log("Received data:", userData);
      console.log("Received profile image:", profileImage);

      const response = await userUseCase.editStudent(
        userData,
        profileImage,
        userId
      );
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for unsubscribing the course
  unSubscribe: async (req, res) => {
    try {
      const courseId = req.params.id;
      const userId = req.body.user_id;
      console.log(`${courseId}, ${userId}`);
      const response = await userUseCase.unSubscribe(courseId, userId);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for getting all the tutor's from the subscribed courses
  getAllTutors: async (req, res) => {
    try {
      const id = req.params.id;
      const response = await userUseCase.getAllTutors(id);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(400).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for log-out
  logoutUser: async (req, res) => {
    try {
      const id = req.params.id;
      const response = await userUseCase.logoutUser(id);
      if (response.success) {
        res
          .clearCookie("access_token")
          .status(200)
          .json({ message: "Logged out successfully" });
      } else {
        res.status(404).json("logout failed");
      }
    } catch (error) {
      console.error("error", error);
    }
  },
};

// exporting the controller
module.exports = userController;
