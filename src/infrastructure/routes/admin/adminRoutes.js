// file to define the admin routes

// importing the required modules for the admin side
const express = require("express");
const router = express.Router();
const upload = require("../../../adapters/middleware/multer");
const adminController = require("../../../adapters/controllers/adminControllers/adminController");
const {
  authenticateAdminJwt,
} = require("../../../adapters/middleware/adminAuth");
const bannerController = require("../../../adapters/controllers/bannerController/bannerController");
const payoutController = require("../../../adapters/controllers/payoutController/payoutController");

// defining all the required routes

// route for getting the admin login
router.post("/", adminController.adminLogin);

// router for getting the user details
router.get("/users", authenticateAdminJwt, adminController.findAllUser);

// router for getting the tutor details
router.get("/tutors", authenticateAdminJwt, adminController.findAllTutor);

// router for blocking and unblocking the tutor
router.patch(
  "/tutor/:id",
  authenticateAdminJwt,
  adminController.tutorBlockUnblock
);

// router for blocking and unblocking the user
router.patch(
  "/user/:id",
  authenticateAdminJwt,
  adminController.userBlockUnblock
);

// router for getting the details for the graph
router.get("/graphs", authenticateAdminJwt, adminController.adminGraphs);

// router for getting the banner
router.get("/banner", authenticateAdminJwt, bannerController.showBanners);

// router for posting the values in the banner
router.post(
  "/add_banner",
  upload.single("banner"),
  authenticateAdminJwt,
  bannerController.addBanner
);

// router for getting the banner for editing
router.get("/banner/:id", authenticateAdminJwt, bannerController.showBanner);

// router for editing the banner
router.put(
  "/banner/:id",
  upload.single("bannerImage"),
  authenticateAdminJwt,
  bannerController.editBanner
);

// router for getting the payouts
router.get(
  "/payout-request",
  authenticateAdminJwt,
  payoutController.showPayouts
);

// router for posting and confirming the payment
router.post(
  "/update-payout-status",
  authenticateAdminJwt,
  payoutController.confirmPayment
);

// router for logging out
router.get("/logout", adminController.adminLogout);

// exporting the routes
module.exports = router;
