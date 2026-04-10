import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./repo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { currentUser } = useAuth();

  const handleCreateRepo = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name) {
      setError("Repository name is required!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3002/repo/create", {
        name,
        description,
        visibility,
        owner: currentUser,
      });

      setSuccess("Repository created successfully!");
      setName("");
      setDescription("");
      setVisibility(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create repository");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="repo-container">
        <div className="error-message">Please login to create a repository</div>
      </div>
    );
  }

  return (
    <div className="repo-container">
      <div className="create-repo-card">
        <h2>Create New Repository</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleCreateRepo}>
          <div className="form-group">
            <label>Repository Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-awesome-repo"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your repository"
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={visibility}
                onChange={(e) => setVisibility(e.target.checked)}
              />
              <span>{visibility ? "Public" : "Private"}</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? "Creating..." : "Create Repository"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRepo;
