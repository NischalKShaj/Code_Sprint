// collection for the tutor
const mongoose = require("mongoose");

const tutor = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default:
        "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg",
    },
    otp: {
      type: String,
    },
    role: {
      type: String,
      default: "tutor",
    },
  },
  { timestamps: true }
);

// exporting the collection
module.exports = new mongoose.model("TemporaryTutor", tutor);
