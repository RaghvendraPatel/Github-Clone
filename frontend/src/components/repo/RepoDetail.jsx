import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./repo.css";

const RepoDetail = () => {
  const { repoId } = useParams();
  const { currentUser } = useAuth();
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [prs, setPRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("issues");
  const [isStarred, setIsStarred] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [creatingIssue, setCreatingIssue] = useState(false);

  useEffect(() => {
    fetchRepoDetails();
  }, [repoId]);

  const fetchRepoDetails = async () => {
    try {
      setLoading(true);
      const repoRes = await axios.get(`http://localhost:3002/repo/${repoId}`);
      setRepo(repoRes.data);

      // Fetch issues for this repository
      try {
        const issuesRes = await axios.get(`http://localhost:3002/issue/all?repoId=${repoId}`);
        setIssues(issuesRes.data || []);
      } catch (err) {
        console.error("Error fetching issues:", err);
        setIssues([]);
      }

      // Fetch pull requests
      try {
        const prsRes = await axios.get(`http://localhost:3002/prs?repoId=${repoId}`);
        setPRs(prsRes.data || []);
      } catch (err) {
        console.error("Error fetching PRs:", err);
        setPRs([]);
      }

      // Check if current user has starred this repo
      if (currentUser) {
        try {
          const userRes = await axios.get(`http://localhost:3002/userProfile/${currentUser}`);
          const userStarRepos = userRes.data.starRepos || [];
          setIsStarred(userStarRepos.includes(repoId));
        } catch (err) {
          console.error("Error checking star status:", err);
          setIsStarred(false);
        }
      }
    } catch (err) {
      console.error("Error fetching repository:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async () => {
    try {
      if (isStarred) {
        // Unstar the repo
        await axios.post(`http://localhost:3002/repo/unstar/${repoId}`, {
          userId: currentUser,
        });
        // Update local state with decremented stars
        setRepo(prev => ({
          ...prev,
          stars: Math.max(0, (prev.stars || 1) - 1)
        }));
      } else {
        // Star the repo
        await axios.post(`http://localhost:3002/repo/star/${repoId}`, {
          userId: currentUser,
        });
        // Update local state with incremented stars
        setRepo(prev => ({
          ...prev,
          stars: (prev.stars || 0) + 1
        }));
      }
      setIsStarred(!isStarred);
    } catch (err) {
      console.error("Error toggling star:", err);
      alert("Failed to update star status. Make sure backend is running!");
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();

    if (!issueTitle.trim()) {
      alert("Issue title is required");
      return;
    }

    try {
      setCreatingIssue(true);
      await axios.post(`http://localhost:3002/issue/create?id=${repoId}`, {
        title: issueTitle,
        description: issueDescription,
        author: currentUser,
      });

      // Clear form
      setIssueTitle("");
      setIssueDescription("");
      setShowCreateForm(false);

      // Refresh issues
      await fetchRepoDetails();
      alert("✅ Issue created successfully!");
    } catch (err) {
      console.error("Error creating issue:", err);
      alert("Failed to create issue. Check console for errors.");
    } finally {
      setCreatingIssue(false);
    }
  };

  if (loading) {
    return <div className="repo-container"><p>Loading repository...</p></div>;
  }

  if (!repo) {
    return <div className="repo-container"><p>Repository not found</p></div>;
  }

  return (
    <div className="repo-container">
      <div className="repo-header">
        <div className="repo-info">
          <h1>{repo.name}</h1>
          <p className="repo-description">{repo.description}</p>
          <div className="repo-meta">
            <span className={`visibility-badge ${repo.visibility ? "public" : "private"}`}>
              {repo.visibility ? "Public" : "Private"}
            </span>
            <span className="repo-stats">⭐ {repo.stars || 0} Stars</span>
          </div>
        </div>
        <button
          className={`btn-star ${isStarred ? "starred" : ""}`}
          onClick={handleStar}
        >
          ⭐ {isStarred ? "Starred" : "Star"}
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "issues" ? "active" : ""}`}
          onClick={() => setActiveTab("issues")}
        >
          Issues ({issues.length})
        </button>
        <button
          className={`tab ${activeTab === "prs" ? "active" : ""}`}
          onClick={() => setActiveTab("prs")}
        >
          Pull Requests ({prs.length})
        </button>
        {activeTab === "issues" && (
          <button
            className="btn-create-issue"
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ marginLeft: "auto" }}
          >
            {showCreateForm ? "✕ Cancel" : "➕ Create Issue"}
          </button>
        )}
      </div>

      {showCreateForm && activeTab === "issues" && (
        <form onSubmit={handleCreateIssue} className="create-issue-form" style={{ padding: "20px", borderBottom: "1px solid #30363d" }}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#c9d1d9" }}>
              Issue Title *
            </label>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="What's the issue?"
              className="form-input"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "6px",
                color: "#c9d1d9",
                fontSize: "14px",
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#c9d1d9" }}>
              Description
            </label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Provide more context..."
              className="form-textarea"
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "6px",
                color: "#c9d1d9",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={creatingIssue}
            style={{
              padding: "8px 16px",
              backgroundColor: "#238636",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: creatingIssue ? "not-allowed" : "pointer",
              opacity: creatingIssue ? 0.5 : 1,
            }}
          >
            {creatingIssue ? "Creating..." : "Create Issue"}
          </button>
        </form>
      )}

      <div className="tab-content">
        {activeTab === "issues" && (
          <div className="issues-list">
            {issues.length === 0 ? (
              <p>No issues yet</p>
            ) : (
              issues.map((issue) => (
                <div key={issue._id} className="issue-item">
                  <div className="issue-header">
                    <h3>{issue.title}</h3>
                    <span className={`status-badge ${issue.status}`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="issue-description">{issue.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "prs" && (
          <div className="prs-list">
            {prs.length === 0 ? (
              <p>No pull requests yet</p>
            ) : (
              prs.map((pr) => (
                <div key={pr._id} className="pr-item">
                  <div className="pr-header">
                    <h3>{pr.title}</h3>
                    <span className={`status-badge ${pr.status}`}>
                      {pr.status}
                    </span>
                  </div>
                  <p className="pr-description">{pr.description}</p>
                  <div className="pr-branches">
                    <span>{pr.fromBranch}</span>
                    <span>→</span>
                    <span>{pr.toBranch}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoDetail;
