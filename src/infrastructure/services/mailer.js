// file to send email to the user

// importing the required modules
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// creating an exporter for the nodemailer
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }
  async sendOtpEmail(recipient, otp) {
    const mailOptions = {
      from: "codesprint06@gmail.com",
      to: recipient,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}. Please don't share your otp with others`,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(info.messageId);
    } catch (error) {
      console.log(error);
    }
  }
}

// exporting the service
module.exports = EmailService;
