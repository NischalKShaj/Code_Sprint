// file to create the use case for the banner

// importing the required modules
const bannerRepository = require("../../../infrastructure/repositories/bannerRepository/bannerRepository");

// creating the use-case
const bannerUseCase = {
  // useCase for showing all the banners
  showBanners: async () => {
    try {
      const response = await bannerRepository.showBanners();
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // useCase for adding the banner
  addBanner: async (bannerData, bannerImage) => {
    try {
      const result = await bannerRepository.addBanner(bannerData, bannerImage);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for finding specific banner
  showBanner: async (bannerId) => {
    try {
      const result = await bannerRepository.showBanner(bannerId);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for banner editing
  editBanner: async (bannerId, bannerData, bannerImage) => {
    try {
      const result = await bannerRepository.editBanner(
        bannerId,
        bannerData,
        bannerImage
      );
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },

  // use case for deleting the banner
  deleteBanner: async (bannerId) => {
    try {
      const result = await bannerRepository.deleteBanner(bannerId);
      if (result) {
        return { success: true, data: result };
      } else {
        return { success: false, data: result };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error.message };
    }
  },
};

// exporting the modules
module.exports = bannerUseCase;
