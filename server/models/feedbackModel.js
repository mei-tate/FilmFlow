const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

/**
 * Feedback is of the form: 
 * {
 *      "_id": ObjectId("..."),
 *      "name": "My Name",
 *      "email": "name@email.com",
 *      "issue": "Spotify playlist import not working",
 *      "date": ISODate("2026-05-27T22:10:14.000Z"),
 *      "__v": 0
 * }
 */
const feedbackSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email",
      },
    },

    issue: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    date: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model(
  "Feedback",
  feedbackSchema
);