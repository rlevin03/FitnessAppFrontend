const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const passOK = bcrypt.compareSync(password, userDoc.password);
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

router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { name, email, verified, classesAttended, _id } =
        await User.findById(userData.id);
      res.json({ name, email, verified, classesAttended, _id });
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.patch("/verify", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User successfully verified", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
