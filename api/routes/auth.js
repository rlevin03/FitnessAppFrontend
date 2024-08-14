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

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

router.delete("/delete-account", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User successfully deleted", user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { name, email, verified, classesAttended, reservations, waitLists, _id } =
        await User.findById(userData.id);
      res.json({ name, email, verified, classesAttended, reservations, waitLists, _id });
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

router.patch("/email-change", async (req, res) => {
  const { email, newEmail } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { email: newEmail },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Email updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/password-change", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const userDoc = await User.findOne({ email });
  if (!bcrypt.compareSync(oldPassword, userDoc.password)) {
    return res
      .status(401)
      .json({ message: "Old password inconsistent with current password" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: bcrypt.hashSync(newPassword, bcryptSalt) },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
