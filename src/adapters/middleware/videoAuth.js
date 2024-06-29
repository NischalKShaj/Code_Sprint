// file to encrypting the videos

// importing the required modules
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const algorithm = "aes-256-gcm";
const secretKey = process.env.CIPHER_SECRETKEY;

module.exports.encrypt = (text) => {
  try {
    console.log("Secret key:", secretKey.length); // Check the secret key before further processing

    // Validate secretKey length and format
    if (!secretKey || secretKey.length !== 64) {
      throw new Error("Invalid secret key length or format.");
    }

    // Convert the secretKey to a Buffer
    const keyBuffer = Buffer.from(secretKey, "hex");

    // Generate a new IV (Initialization Vector)
    const iv = crypto.randomBytes(16);

    // Create the cipher object
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");

    // Get the authentication tag
    const tag = cipher.getAuthTag();

    // Return IV, tag, and encrypted text concatenated together
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error; // Throw the error to handle it in the calling code
  }
};
