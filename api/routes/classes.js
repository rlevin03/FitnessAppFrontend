const express = require("express");
const ClassModel = require("../models/Class");
const UserModel = require("../models/User");
const { default: mongoose } = require("mongoose");

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

router.get("/reservations", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send("Missing userId");
  }

  try {
    const user = await UserModel.findById(userId)
      .populate("reservations")
      .populate("waitLists");

    if (!user) {
      return res.status(404).send("User not found");
    }

    const classes = {
      reservations: user.reservations,
      waitLists: user.waitLists,
    };

    res.status(200).json(classes);
  } catch (err) {
    console.error("Error fetching user reservations:", err);
    res.status(500).json({ message: err.message });
  }
});

router.patch("/reserve", async (req, res) => {
  const { userId, classId } = req.body;

  if (!userId || !classId) {
    return res.status(400).json({ message: "Missing userId or classId" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(classId)
  ) {
    return res.status(400).json({ message: "Invalid userId or classId" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const cls = await ClassModel.findById(classId).session(session);
    if (!cls) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Class not found" });
    }

    if (
      cls.usersSignedUp.includes(userId) ||
      cls.usersOnWaitList.includes(userId)
    ) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "User is already registered for this class" });
    }

    if (cls.signeesAmount < cls.maxCapacity) {
      cls.signeesAmount++;
      user.reservations.push(classId);
      cls.usersSignedUp.push(userId);
    } else if (cls.waitListSigneesAmount < cls.waitListCapacity) {
      cls.waitListSigneesAmount++;
      user.waitLists.push(classId);
      cls.usersOnWaitList.push(userId);
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: "Class and waitlist are full" });
    }

    await cls.save({ session });
    await user.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Reservation successful", classData: cls });
  } catch (err) {
    console.error("Error reserving class:", err);
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

router.patch("/cancel", async (req, res) => {
  const { userId, classId } = req.body;

  if (!userId || !classId) {
    return res.status(400).json({ message: "Missing userId or classId" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(classId)
  ) {
    return res.status(400).json({ message: "Invalid userId or classId" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const cls = await ClassModel.findById(classId).session(session);
    if (!cls) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Class not found" });
    }

    const userIndex = cls.usersSignedUp.indexOf(userId);
    if (userIndex !== -1) {
      cls.signeesAmount--;
      cls.usersSignedUp.splice(userIndex, 1);
      user.reservations = user.reservations.filter(
        (reservation) => reservation.toString() !== classId
      );
    } else {
      const waitListIndex = cls.usersOnWaitList.indexOf(userId);
      if (waitListIndex !== -1) {
        cls.waitListSigneesAmount--;
        cls.usersOnWaitList.splice(waitListIndex, 1);
        user.waitLists = user.waitLists.filter(
          (waitList) => waitList.toString() !== classId
        );
      } else {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "User is not registered for this class" });
      }
    }

    await cls.save({ session });
    await user.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Cancellation successful", classData: cls });
  } catch (err) {
    console.error("Error cancelling class:", err);
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
