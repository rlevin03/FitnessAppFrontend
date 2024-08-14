const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send-verification-code", (req, res) => {
  const { email, code } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    } else {
      return res.status(200).json({ message: "Verification code sent" });
    }
  });
});

router.post("/feedback", (req, res) => {
  const { feedback } = req.body;

  const feedbackMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Feedback",
    text: feedback,
  };

  transporter.sendMail(feedbackMailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    } else {
      return res.status(200).json({ message: "Feedback sent successfully" });
    }
  });
});

module.exports = router;
