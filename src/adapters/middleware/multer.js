// file to configure the multer

// importing the required modules
const multer = require("multer");
const path = require("path");

// configuring multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where uploaded files will be stored
    cb(
      null,
      path.join(__dirname, "../../infrastructure/storage/uploads/image")
    );
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
