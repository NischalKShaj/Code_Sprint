// file for the users controller
const userUseCase = require("../../application/usecase/userUseCase");
const tutorUseCase = require("../../application/usecase/tutorUseCase");
const EmailService = require("../../infrastructure/services/mailer");

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
    console.log(user);
    try {
      let details;
      if (user.selectedRole === "student") {
        console.log("student");
        details = await userUseCase.findUser(user);
      } else if (user.selectedRole === "tutor") {
        console.log("tutor");
        details = await tutorUseCase.findTutor(user);
      }
      if (details.success) {
        res.status(202).json(details.data);
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
      console.log(userData);

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
        res.status(409).json("invalid otp");
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  },
};

// exporting the controller
module.exports = userController;
