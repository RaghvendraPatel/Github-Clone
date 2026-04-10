const Comment = require("../models/commentModel");

async function createComment(req, res) {
  const { content, issueId, prId } = req.body;
  const { userId } = req.params;

  if (!content || (!issueId && !prId)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const comment = new Comment({
      content,
      author: userId,
      issue: issueId || null,
      pullRequest: prId || null,
    });

    await comment.save();
    await comment.populate("author", "username email");
    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getComments(req, res) {
  const { issueId, prId } = req.query;

  try {
    let query = {};
    if (issueId) query.issue = issueId;
    if (prId) query.pullRequest = prId;

    const comments = await Comment.find(query).populate("author", "username email");
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateComment(req, res) {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).populate("author", "username email");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteComment(req, res) {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
