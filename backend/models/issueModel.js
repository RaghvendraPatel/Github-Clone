const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true,
  },
  author: {
    type: String,
    default: "Anonymous",
  },
}, { timestamps: true });

const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;