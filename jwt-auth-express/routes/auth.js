const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const router = express.Router();

let users = []; // Temporary in-memory storage for user data

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Hash the password for security
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the new user
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully." });
});

// Log in an existing user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find the user
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate a JWT
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ message: "Login successful", token });
});

// Access a protected route
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}! Welcome to the protected route.`,
  });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token is required." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user; // Attach user info from token to the request object
    next();
  });
}

module.exports = router;
