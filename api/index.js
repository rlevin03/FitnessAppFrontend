const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const dbUrl = process.env.MONGO_URL;
const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Database Connection
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// Routes
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const classRoutes = require("./routes/classes");

app.use(`/auth`, authRoutes);
app.use(`/email`, emailRoutes);
app.use(`/classes`, classRoutes);

app.get("/", (req, res) => {
  res.json("Hello Ilya");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
