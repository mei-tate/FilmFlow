const express = require("express");
const Bookmark = require("../models/bookmarkModel");

const router = express.Router();

//
// GET all bookmarks
//
router.get("/", async (req, res) => {
  try {
    const bookmarks =
      await Bookmark.find().sort({
        createdAt: -1,
      });

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/check/:moviePath", async (req, res) => {
  try {
    const { moviePath } = req.params;

    const existing = await Bookmark.findOne({ moviePath });

    res.status(200).json({
      bookmarked: !!existing,
      bookmark: existing || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// POST add bookmark
//
router.post("/", async (req, res) => {
  try {
    const {
      title,
      posterPath,
      date,
      moviePath,
    } = req.body;

    // Prevent duplicates
    const existing =
      await Bookmark.findOne({
        title,
      });

    if (existing) {
      return res.status(400).json({
        message:
          "Movie already bookmarked",
      });
    }

    const bookmark =
      await Bookmark.create({
        title,
        posterPath,
        date,
        moviePath,
      });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

//
// DELETE bookmark
//
router.delete("/:id", async (req, res) => {
  try {
    const bookmark =
      await Bookmark.findByIdAndDelete(
        req.params.id
      );

    if (!bookmark) {
      return res.status(404).json({
        message:
          "Bookmark not found",
      });
    }

    res.status(200).json({
      message:
        "Bookmark removed",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;