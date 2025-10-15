// models/Group.js
const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  name: String,
  participants: [{ type: String, required: true }], // Array of userIds
});

export default mongoose.model("Group", GroupSchema);
