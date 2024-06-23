// collection for banner

// importing the required modules
const mongoose = require("mongoose");

// creating the schema
const banners = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
});

// exporting the module
module.exports = new mongoose.model("Banners", banners);
