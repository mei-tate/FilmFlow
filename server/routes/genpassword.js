const express = require("express");
const crypto = require("crypto");

const router = express.Router();


// Character sets
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// Secure random integer helper
function getRandomInt(max) {
  return crypto.randomInt(0, max);
}

// Build character pool
function buildCharPool(options) {
  let pool = "";

  if (options.includeLowercase) pool += LOWER;
  if (options.includeUppercase) pool += UPPER;
  if (options.includeNumbers) pool += NUMBERS;
  if (options.includeSymbols) pool += SYMBOLS;

  return pool;
}

// Generate password
function generatePassword(length, pool) {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += pool[getRandomInt(pool.length)];
  }
  return password;
}

// POST /api/password/generate
router.post("/generate", (req, res) => {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = false,
  } = req.body;

  if (typeof length !== "number" || length < 4 || length > 25) {
    return res.status(400).json({
      error: "Length must be a number between 4 and 25",
    });
  }

  const pool = buildCharPool({
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  });

  if (!pool.length) {
    return res.status(400).json({
      error: "At least one character type must be enabled",
    });
  }

  const password = generatePassword(length, pool);

  res.json({
    password,
    length,
    options: {
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    },
  });
});

// Health route
router.get("/", (req, res) => {
  res.json({ status: "Password service is running" });
});

module.exports = router;