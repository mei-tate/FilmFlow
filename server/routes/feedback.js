const express = require("express");
const Feedback = require("../models/feedbackModel");

const router = express.Router();

// POST feedback route
router.post("/", async (req, res) => {
  const { name, email, issue } = req.body;

  try {
    // Validation
    if (!name || !email || !issue) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Save feedback
    await Feedback.create({
      name,
      email,
      issue,
    });

    res.status(200).json({
      message: "Thanks for your feedback!",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error submitting feedback.",
    });
  }
});

module.exports = router;