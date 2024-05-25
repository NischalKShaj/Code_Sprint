// file for creating the repository for the tutor

// importing the required modules
const TutorCollection = require("../../core/entities/tutorCollection");
const bcryptjs = require("bcryptjs");

// creating tutor repository
const tutorRepository = {
  // method for signup
  createTutor: async (tutorData) => {
    try {
      const tutorEmail = tutorData.email;
      const existingTutor = await TutorCollection.findOne({
        email: tutorEmail,
      });
      if (!existingTutor) {
        const hashedPassword = bcryptjs.hashSync(tutorData.password, 10);
        const newTutor = new TutorCollection({
          username: tutorData.username,
          email: tutorData.email,
          password: hashedPassword,
          phone: tutorData.phone,
        });
        await newTutor.save();
        console.log(newTutor);
        return newTutor;
      }
    } catch (error) {
      console.log("error while signup the tutor", error);
      return null;
    }
  },
};

module.exports = tutorRepository;
