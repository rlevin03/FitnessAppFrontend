const express = require("express");
const ClassModel = require("../models/Class");

const router = express.Router();

router.get("/", async (req, res) => {
  const { date, types, campuses, instructors } = req.query;

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

  if (instructors) {
    query.instructor = { $in: instructors.split(",") };
  }

  try {
    const classes = await ClassModel.find(query);
    res.json(classes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
