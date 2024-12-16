const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

//Middleware
app.use(bodyParser.json()); //Parse JSON request bodies

//Mock user database (dummy data)
const users = [];

//Routes
app.get("/", (req, res) => {
  res.send("Basic Auth");
});

// Register new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }

  //Check if username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Save the user
  user.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
});

//Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Find the user
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  //Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid username or password" });
  }

  res.json({ message: "Login successful!" });
});
