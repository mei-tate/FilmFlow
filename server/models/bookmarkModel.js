const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    title: {
      type: String,
      required: true,
    },

    posterPath: {
      type: String,
      required: true,
    },

    date: {
      type: String,
    },

    moviePath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Bookmark",
  bookmarkSchema
);