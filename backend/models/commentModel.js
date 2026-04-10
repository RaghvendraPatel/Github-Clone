const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issue: {
    type: Schema.Types.ObjectId,
    ref: "Issue",
  },
  pullRequest: {
    type: Schema.Types.ObjectId,
    ref: "PullRequest",
  },
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
