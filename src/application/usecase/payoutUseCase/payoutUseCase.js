// file to implement the payout for the project

// import the required modules
const payoutRepository = require("../../../infrastructure/repositories/payoutRepository/payoutRepository");

// creating the use case for the payment
const payoutUseCase = {
  // use case for adding the payment request
  addPaymentRequest: async (id, wallet) => {
    try {
      const response = await payoutRepository.addPaymentRequest(id, wallet);
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

  // use case for showing all the payouts
  showPayouts: async () => {
    try {
      const response = await payoutRepository.showPayouts();
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

  // use case to confirm the payment for the tutor
  confirmPayment: async (id) => {
    try {
      const response = await payoutRepository.confirmPayment(id);
      if (response) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  },

  // use case for enabling the premium features
  premiumSubscription: async (userId) => {
    try {
      const response = await payoutRepository.premiumSubscription(userId);
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

  // use case for payment history
  getPaymentHistory: async (id) => {
    try {
      const response = await payoutRepository.getPaymentHistory(id);
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
};

module.exports = payoutUseCase;
