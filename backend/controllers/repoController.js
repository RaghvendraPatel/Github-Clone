const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function starRepository(req, res) {
  const { repoId } = req.params;
  const { userId } = req.body;

  try {
    // Validate inputs
    if (!repoId || !userId) {
      console.error("❌ Missing repoId or userId:", { repoId, userId });
      return res.status(400).json({ error: "Repository ID and User ID are required" });
    }

    console.log(`⭐ Star request - RepoID: ${repoId}, UserID: ${userId}`);

    const repo = await Repository.findById(repoId);
    const user = await User.findById(userId);

    if (!repo) {
      console.error("❌ Repository not found:", repoId);
      return res.status(404).json({ error: "Repository not found!" });
    }

    if (!user) {
      console.error("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found!" });
    }

    // Check if already starred
    const alreadyStarred = user.starRepos.includes(repoId);

    if (!alreadyStarred) {
      user.starRepos.push(repoId);
      repo.stars = (repo.stars || 0) + 1;

      await user.save();
      await repo.save();

      console.log(`✅ Repository starred! New star count: ${repo.stars}`);
    } else {
      console.log(`ℹ️ Repository already starred by this user`);
    }

    res.json({
      message: "Repository starred!",
      stars: repo.stars,
      starRepos: user.starRepos.length,
    });
  } catch (err) {
    console.error("❌ Error starring repository:", err);
    res.status(500).json({ error: "Failed to star repository", details: err.message });
  }
}

async function unstarRepository(req, res) {
  const { repoId } = req.params;
  const { userId } = req.body;

  try {
    // Validate inputs
    if (!repoId || !userId) {
      console.error("❌ Missing repoId or userId:", { repoId, userId });
      return res.status(400).json({ error: "Repository ID and User ID are required" });
    }

    console.log(`⭐ Unstar request - RepoID: ${repoId}, UserID: ${userId}`);

    const repo = await Repository.findById(repoId);
    const user = await User.findById(userId);

    if (!repo) {
      console.error("❌ Repository not found:", repoId);
      return res.status(404).json({ error: "Repository not found!" });
    }

    if (!user) {
      console.error("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found!" });
    }

    // Remove from starRepos
    user.starRepos = user.starRepos.filter(id => id.toString() !== repoId);
    repo.stars = Math.max(0, (repo.stars || 0) - 1);

    await user.save();
    await repo.save();

    console.log(`✅ Repository unstarred! New star count: ${repo.stars}`);

    res.json({
      message: "Repository unstarred!",
      stars: repo.stars,
      starRepos: user.starRepos.length,
    });
  } catch (err) {
    console.error("❌ Error unstarring repository:", err);
    res.status(500).json({ error: "Failed to unstar repository", details: err.message });
  }
}

async function getStarredRepositories(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("starRepos");

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json(user.starRepos);
  } catch (err) {
    console.error("Error fetching starred repositories:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
  starRepository,
  unstarRepository,
  getStarredRepositories,
};