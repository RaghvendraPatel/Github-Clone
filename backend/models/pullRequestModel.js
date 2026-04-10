const mongoose = require("mongoose");
const { Schema } = mongoose;

const PullRequestSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fromBranch: {
    type: String,
    required: true,
  },
  toBranch: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed", "merged"],
    default: "open",
  },
  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
}, { timestamps: true });

const PullRequest = mongoose.model("PullRequest", PullRequestSchema);
module.exports = PullRequest;
