// file to login the user using the OAuth

// importing the required modules
const OAuthUseCase = require("../../../application/usecase/courseUseCase/courseUseCase");

// creating the controller for the OAuth
const oAuth = {
  postOAuth: async (req, res) => {
    const user = req.body;
    console.log("user", user);
    try {
      const result = await OAuthUseCase.oAuth(user);
      if (result.success) {
        res.status(200).json(result.data);
      } else {
        res.status(404).json("user not found");
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }
  },
};

module.exports = oAuth;
