// creating the repository for the banner

// importing the required modules
const BannerCollection = require("../../../core/entities/banner/bannerCollection");

// creating the banner repository
const bannerRepository = {
  // method for showing all the banners
  showBanners: async () => {
    try {
      const bannerData = await BannerCollection.find();
      console.log("bannerData", bannerData);
      if (bannerData) {
        return bannerData;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for adding a banner
  addBanner: async (bannerData, bannerImage) => {
    try {
      console.log("bannerData", bannerData);
      const banner = new BannerCollection({
        name: bannerData.banner_name,
        description: bannerData.banner_description,
        bannerImage: bannerImage,
      });
      const savedBanner = await banner.save();
      console.log("banner repo", savedBanner);
      if (savedBanner) {
        return savedBanner;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for finding specific banner
  showBanner: async (bannerId) => {
    try {
      const banner = await BannerCollection.findById({ _id: bannerId });
      console.log("banner", banner);
      if (banner) {
        return banner;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for editing the banner
  editBanner: async (bannerId, bannerData, bannerImage) => {
    try {
      const banner = {
        name: bannerData.banner_name,
        description: bannerData.banner_description,
      };
      if (bannerImage) {
        banner.bannerImage = bannerImage;
      }
      const bannerDetails = await BannerCollection.findByIdAndUpdate(
        bannerId,
        banner,
        { new: true }
      );

      console.log("first", bannerDetails);

      if (bannerDetails) {
        return bannerDetails;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  // method for deleting the banner
  deleteBanner: async (bannerId) => {
    try {
      const banner = await BannerCollection.findByIdAndDelete({
        _id: bannerId,
      });
      if (banner) {
        return "deleted";
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = bannerRepository;
