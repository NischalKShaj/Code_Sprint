// file to create the banner controller for the admin side

// importing the required modules
const bannerUseCase = require("../../../application/usecase/bannerUseCase/bannerUseCase");

// creating the banner controller
const bannerController = {
  // controller to show all the banner
  showBanners: async (req, res) => {
    try {
      const response = await bannerUseCase.showBanners();
      if (response.success) {
        res.status(200).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for adding the banner
  addBanner: async (req, res) => {
    try {
      const bannerData = req.body;
      const bannerImage = req.file
        ? `http://localhost:4000/uploads/image/${req.file.filename}`
        : null;

      const response = await bannerUseCase.addBanner(bannerData, bannerImage);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for showing specific banner
  showBanner: async (req, res) => {
    try {
      const bannerId = req.params.id;
      const response = await bannerUseCase.showBanner(bannerId);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for editing the banner
  editBanner: async (req, res) => {
    try {
      const bannerId = req.params.id;
      const bannerData = req.body;
      const bannerImage = req.file
        ? `http://localhost:4000/uploads/image/${req.file.filename}`
        : null;

      console.log(
        `banner id${bannerId}, banner data ${bannerData.banner_name},banner Image ${bannerImage}`
      );

      const response = await bannerUseCase.editBanner(
        bannerId,
        bannerData,
        bannerImage
      );
      if (response) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // controller for deleting the banner
  deleteBanner: async (req, res) => {
    try {
      const bannerId = req.params.id;
      const response = await bannerUseCase.deleteBanner(bannerId);
      if (response.success) {
        res.status(202).json("banner deleted successfully");
      } else {
        res.status(400).json("banner deletion failed");
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

// exporting the bannerController
module.exports = bannerController;
