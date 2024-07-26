const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClassSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  campus: { type: String, required: true },
  startTime: { type: String, required: true },
  duration: { type: Number, required: true },
  location: { type: String, required: true },
  instructor: { type: String, required: true },
  substitute: { type: Boolean, default: false },
  signeesAmount: { type: Number, default: 0 },
  maxCapacity: { type: Number, required: true },
  minCapacity: { type: Number, required: true },
  isFull: { type: Boolean, default: false },
  waitListCapacity: { type: Number, default: 0 },
  waitListSigneesAmount: { type: Number, default: 0 },
  isWaitListFull: { type: Boolean, default: false },
  description: { type: String, required: true },
  skillLevel: { type: String, required: true },
  intensityLevel: { type: String, required: true },
  equipmentUsed: [String],
  usersSignedUp: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  usersOnWaitList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
  timestamps: true,
});

const ClassModel = mongoose.model("Class", ClassSchema);

module.exports = ClassModel;
