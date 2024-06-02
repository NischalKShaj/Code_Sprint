// file for the admin repository

// importing the required files
const dotenv = require("dotenv");
dotenv.config();

// creating admin repository
const adminRepository = {
  adminLogin: async (data) => {
    try {
      const email = data.email;
      const password = data.password;
      if (
        email === process.env.ADMIN_LOGIN &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = adminRepository;
