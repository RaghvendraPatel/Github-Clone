const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

async function signup(req, res) {
  const { username, password, email } = req.body;

  // Validate required fields
  if (!username || !password || !email) {
    return res.status(400).json({
      message: "Missing required fields: username, password, email"
    });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during signup : ", err);
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    const user = await User.findById(currentID);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(
      currentID,
      updateFields,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    const user = await User.findByIdAndDelete(currentID);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function followUser(req, res) {
  const { userId } = req.params;
  const { followId } = req.body;

  try {
    if (userId === followId) {
      return res.status(400).json({ message: "Cannot follow yourself!" });
    }

    const user = await User.findById(userId);
    const userToFollow = await User.findById(followId);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user.followedUsers.includes(followId)) {
      user.followedUsers.push(followId);
      await user.save();
    }

    res.json({ message: "User followed successfully!" });
  } catch (err) {
    console.error("Error following user:", err);
    res.status(500).json({ error: err.message });
  }
}

async function unfollowUser(req, res) {
  const { userId } = req.params;
  const { unfollowId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.followedUsers = user.followedUsers.filter(id => id.toString() !== unfollowId);
    await user.save();

    res.json({ message: "User unfollowed successfully!" });
  } catch (err) {
    console.error("Error unfollowing user:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getFollowers(req, res) {
  const { userId } = req.params;

  try {
    const users = await User.find({ followedUsers: userId });
    res.json(users);
  } catch (err) {
    console.error("Error fetching followers:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getFollowing(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("followedUsers", "username email");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(user.followedUsers);
  } catch (err) {
    console.error("Error fetching following:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};