// file to add the services for the uploading of the files in the s3 bucket

// importing the required modules
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const BUCKET_SECRET_KEY = process.env.BUCKET_SECRET_KEY;

// creating s3 client
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_KEY,
  },
  region: REGION,
});

// creating the multer upload
const Multer = () =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldname: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  }).array("courses", 5);

module.exports = Multer;
