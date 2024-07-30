const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cors = require("cors");
const helmet = require("helmet");

const User = require("./models/User");
const ClassModel = require("./models/Class");
const app = express();
const dbUrl = process.env.MONGO_URL;
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connection
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.get(api + "/", (req, res) => {
  res.json("Hello World");
});

app.post(`${api}/register`, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ message: "User registered successfully", userDoc });
  } catch (error) {
    res.status(422).json({ error });
  }
});

app.post(`${api}/login`, async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const passOK = await bcrypt.compareSync(password, userDoc.password);
    if (!passOK) {
      return res.status(401).json({ message: "Password incorrect" });
    }
    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Error signing token", err });
        }
        res
          .cookie("token", token, { httpOnly: true, secure: true })
          .json(userDoc);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.get(`${api}/profile`, (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get(`${api}/classes`, async (req, res) => {
  const { date, types, campuses } = req.query;

  let query = {};

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  }

  if (types) {
    query.type = { $in: types.split(",") };
  }

  if (campuses) {
    query.campus = { $in: campuses.split(",") };
  }

  try {
    const classes = await ClassModel.find(query);
    res.json(classes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(4000, () => {
  console.log("Server is running http://localhost:4000");
});
