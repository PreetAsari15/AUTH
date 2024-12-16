require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json()); //Parse incoming JSON requests

//API routes
app.use("/auth", authRoutes);

//Starting server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
