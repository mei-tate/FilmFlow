const express = require("express");

const router = express.Router();

// Count playlist songs
router.post("/count", (req, res) => {
  try {
    const { songs } = req.body;

    // Validate request
    if (!Array.isArray(songs)) {
      return res.status(400).json({
        success: false,
        message: "Songs must be an array.",
      });
    }

    const songCount = songs.length;

    res.status(200).json({
      success: true,
      songCount,
      message: "Playlist count retrieved successfully.",
    });
  } catch (error) {
    console.error("Playlist count error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to count playlist songs.",
    });
  }
});

module.exports = router;