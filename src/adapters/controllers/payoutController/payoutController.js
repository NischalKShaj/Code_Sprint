// file to implement the payout requests

// importing the required modules
const payoutUseCase = require("../../../application/usecase/payoutUseCase/payoutUseCase");

// creating the payout controller
const payoutController = {
  // controller for adding the payment request
  addPaymentRequest: async (req, res) => {
    try {
      const { id, wallet } = req.body;
      const response = await payoutUseCase.addPaymentRequest(id, wallet);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for getting all the payouts
  showPayouts: async (req, res) => {
    try {
      const response = await payoutUseCase.showPayouts();
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for confirming the payment
  confirmPayment: async (req, res) => {
    try {
      const { id } = req.body;
      const response = await payoutUseCase.confirmPayment(id);
      if (response.success) {
        res.status(200).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for adding the premium subscription for the courses
  premiumSubscription: async (req, res) => {
    try {
      const userId = req.body.id;
      const response = await payoutUseCase.premiumSubscription(userId);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(404).json(response.data);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },

  // controller for getting the payment history for the user
  getPaymentHistory: async (req, res) => {
    try {
      const id = req.params.id;
      console.log("id", id);
      const response = await payoutUseCase.getPaymentHistory(id);
      if (response.success) {
        res.status(202).json(response.data);
      } else {
        res.status(400).json(response.data);
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = payoutController;
