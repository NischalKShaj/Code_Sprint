// file to create the use case for the category

// importing the required modules
const categoryRepository = require("../../../infrastructure/repositories/categoryRepository/categoryRepository");

// creating the use case
const categoryUseCase = {
  // use case for adding a category
  addCategory: async (category) => {
    try {
      const category_name = category.toLowerCase();
      const response = await categoryRepository.addCategory(category_name);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error };
    }
  },

  // usecase for showing the category
  showCategory: async () => {
    try {
      const response = await categoryRepository.showCategory();
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      console.error("error", error);
      return { success: false, data: error };
    }
  },
};

module.exports = categoryUseCase;
