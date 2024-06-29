// file to add the services for the uploading of the files in the s3 bucket

// importing the required modules
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const dotenv = require("dotenv");
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const BUCKET_SECRET_KEY = process.env.BUCKET_SECRET_KEY;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL; // Add this line to .env

// creating S3 client for AWS SDK v3
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_KEY,
  },
});

// creating SQS client for AWS SDK v3
const sqs = new SQSClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_KEY,
  },
});

// creating the multer upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
}).fields([
  { name: "course_files", maxCount: 10 },
  ...Array.from({ length: 10 }).map((_, index) => ({
    name: `chapters[${index}][files]`,
    maxCount: 5,
  })),
]);

async function sendMessageToQueue(message) {
  const params = {
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(message),
  };
  try {
    const data = await sqs.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
  } catch (err) {
    console.error("Error", err);
  }
}

module.exports = { upload, sendMessageToQueue };
