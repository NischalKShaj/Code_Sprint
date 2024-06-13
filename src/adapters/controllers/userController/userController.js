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
    await userUseCase.getHome();
    res.status(200).json("home page");
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
      console.log("role", role);
      const userData = req.body;
      console.log("userData", userData);

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
      const { amount } = req.body;

      // Initialize Razorpay instance with API keys
      const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      // Configuration options for creating an order
      const options = {
        amount: parseInt(amount, 10) * 100, // amount in smallest currency unit
        currency: "INR", // Adjust currency as per your requirements
        receipt: "order_rcptid_11", // Example receipt ID
      };

      try {
        // Create an order using Razorpay API
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
      } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
      }
    } else {
      // Respond with Method Not Allowed for non-POST requests
      res.status(405).json({ error: "Method not allowed" });
    }
  },

  // controller for log-out
  logoutUser: (req, res) => {
    try {
      res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("error", error);
    }
  },
};

// exporting the controller
module.exports = userController;
