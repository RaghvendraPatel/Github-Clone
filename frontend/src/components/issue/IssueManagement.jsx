import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./issue.css";

const IssueManagement = () => {
  const { repoId } = useParams();
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchIssues();
  }, [repoId, filter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3002/issue/all?repoId=${repoId}`);
      let filtered = response.data;
      if (filter !== "all") {
        filtered = filtered.filter((issue) => issue.status === filter);
      }
      setIssues(filtered);
    } catch (err) {
      console.error("Error fetching issues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Title is required");
      return;
    }

    try {
      await axios.post(`http://localhost:3002/issue/create?id=${repoId}`, {
        title,
        description,
        author: currentUser,
      });
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchIssues();
    } catch (err) {
      console.error("Error creating issue:", err);
      alert("Failed to create issue");
    }
  };

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      await axios.put(`http://localhost:3002/issue/update/${issueId}`, {
        status: newStatus,
      });
      fetchIssues();
    } catch (err) {
      console.error("Error updating issue:", err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await axios.delete(`http://localhost:3002/issue/delete/${issueId}`);
        fetchIssues();
      } catch (err) {
        console.error("Error deleting issue:", err);
      }
    }
  };

  return (
    <div className="issue-container">
      <div className="issue-header">
        <h2>Issues</h2>
        <button
          className="btn-create-issue"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create Issue"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateIssue} className="issue-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Issue description"
              className="form-textarea"
              rows="4"
            />
          </div>

          <button type="submit" className="btn-submit">
            Create Issue
          </button>
        </form>
      )}

      <div className="issue-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "open" ? "active" : ""}`}
          onClick={() => setFilter("open")}
        >
          Open
        </button>
        <button
          className={`filter-btn ${filter === "closed" ? "active" : ""}`}
          onClick={() => setFilter("closed")}
        >
          Closed
        </button>
      </div>

      {loading ? (
        <p>Loading issues...</p>
      ) : issues.length === 0 ? (
        <p className="no-issues">No issues found</p>
      ) : (
        <div className="issues-grid">
          {issues.map((issue) => (
            <div key={issue._id} className="issue-card">
              <div className="issue-card-header">
                <h3>{issue.title}</h3>
                <span className={`status-badge ${issue.status}`}>
                  {issue.status}
                </span>
              </div>
              <p className="issue-card-description">{issue.description}</p>
              <div className="issue-card-actions">
                <select
                  value={issue.status}
                  onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
                  className="status-select"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  onClick={() => handleDeleteIssue(issue._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueManagement;
