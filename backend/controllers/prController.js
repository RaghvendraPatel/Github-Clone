const PullRequest = require("../models/pullRequestModel");
const Repository = require("../models/repoModel");

async function createPR(req, res) {
  const { title, description, fromBranch, toBranch, repoId } = req.body;
  const { userId } = req.params;

  try {
    const pullRequest = new PullRequest({
      title,
      description,
      fromBranch,
      toBranch,
      repository: repoId,
      author: userId,
    });

    await pullRequest.save();
    await pullRequest.populate("author", "username email");
    await pullRequest.populate("repository", "name");

    // Add PR to repository
    await Repository.findByIdAndUpdate(repoId, {
      $push: { pullRequests: pullRequest._id },
    });

    res.status(201).json(pullRequest);
  } catch (err) {
    console.error("Error creating PR:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getPRs(req, res) {
  const { repoId, status } = req.query;

  try {
    let query = {};
    if (repoId) query.repository = repoId;
    if (status) query.status = status;

    const prs = await PullRequest.find(query)
      .populate("author", "username email")
      .populate("repository", "name");

    res.json(prs);
  } catch (err) {
    console.error("Error fetching PRs:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getPRById(req, res) {
  const { id } = req.params;

  try {
    const pr = await PullRequest.findById(id)
      .populate("author", "username email")
      .populate("repository", "name")
      .populate("comments");

    if (!pr) {
      return res.status(404).json({ message: "PR not found" });
    }

    res.json(pr);
  } catch (err) {
    console.error("Error fetching PR:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updatePR(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const pr = await PullRequest.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    ).populate("author", "username email");

    if (!pr) {
      return res.status(404).json({ message: "PR not found" });
    }

    res.json(pr);
  } catch (err) {
    console.error("Error updating PR:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deletePR(req, res) {
  const { id } = req.params;

  try {
    const pr = await PullRequest.findByIdAndDelete(id);

    if (!pr) {
      return res.status(404).json({ message: "PR not found" });
    }

    // Remove PR from repository
    await Repository.findByIdAndUpdate(pr.repository, {
      $pull: { pullRequests: id },
    });

    res.json({ message: "PR deleted successfully" });
  } catch (err) {
    console.error("Error deleting PR:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createPR,
  getPRs,
  getPRById,
  updatePR,
  deletePR,
};
