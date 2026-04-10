const mongoose = require("mongoose");
const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");

async function createIssue(req, res) {
  const { title, description, author } = req.body;
  let repoId = req.query.id || req.params.id;

  try {
    if (!title || !repoId) {
      return res.status(400).json({ message: "Title and repository ID are required" });
    }

    // Convert string ID to MongoDB ObjectId
    if (typeof repoId === 'string') {
      if (!mongoose.Types.ObjectId.isValid(repoId)) {
        return res.status(400).json({ message: "Invalid repository ID format" });
      }
      repoId = mongoose.Types.ObjectId(repoId);
    }

    console.log(`🔴 Creating issue for repo:`, repoId);

    // Verify repository exists first
    const repo = await Repository.findById(repoId);
    if (!repo) {
      console.error(`❌ Repository not found: ${repoId}`);
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Create the issue
    const issue = new Issue({
      title,
      description,
      repository: repoId,
      author: author || "Anonymous",
      status: "open",
    });

    await issue.save();
    console.log(`✅ Issue saved to DB with ID: ${issue._id}`);

    // Add issue to repository's issues array
    repo.issues.push(issue._id);
    await repo.save();
    console.log(`✅ Issue linked to repo. Repo now has ${repo.issues.length} issues`);

    res.status(201).json({
      ...issue.toObject(),
      message: "Issue created successfully!",
    });
  } catch (err) {
    console.error("❌ Error during issue creation:", err);
    res.status(500).json({ error: "Failed to create issue", details: err.message });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();

    res.json({ ...issue.toObject(), message: "Issue updated" });
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllIssues(req, res) {
  let repoId = req.query.repoId || req.params.id;

  try {
    let issues;

    if (repoId) {
      // Convert string ID to MongoDB ObjectId
      if (typeof repoId === 'string') {
        if (!mongoose.Types.ObjectId.isValid(repoId)) {
          console.warn(`⚠️ Invalid repo ID format: ${repoId}`);
          return res.status(200).json([]);
        }
        repoId = mongoose.Types.ObjectId(repoId);
      }

      console.log(`🔴 Fetching issues for repo: ${repoId}`);
      issues = await Issue.find({ repository: repoId });
      console.log(`✅ Found ${issues.length} issues for repo`);
    } else {
      console.log(`🔴 Fetching all issues`);
      issues = await Issue.find({});
      console.log(`✅ Found ${issues.length} total issues`);
    }

    res.status(200).json(issues || []);
  } catch (err) {
    console.error("❌ Error fetching issues:", err);
    res.status(500).json({ error: "Failed to fetch issues", details: err.message });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};