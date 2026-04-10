import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import Navbar from "../Navbar";
import Avatar from "../Avatar";
import { Loading, Error } from "../StateIndicators";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendingRepos, setTrendingRepos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:3002/repo/user/${userId}`
        );
        setRepositories(response.data.repositories || []);
      } catch (err) {
        console.error("Error fetching user repositories:", err);
        setError("Failed to load your repositories");
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/repo/all`);
        const allRepos = response.data || [];

        // Filter out user's own repos and sort by stars
        const filtered = allRepos
          .filter((repo) => repo.owner?.toString() !== userId)
          .sort((a, b) => (b.stars || 0) - (a.stars || 0));

        setSuggestedRepositories(filtered.slice(0, 8));

        // Get trending (by stars)
        setTrendingRepos(filtered.slice(0, 5));
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRepositories();
      fetchSuggestedRepositories();
    }
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const handleRepoClick = (repoId) => {
    navigate(`/repo/${repoId}`);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCreateRepo = () => {
    navigate("/create");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <>
        <Navbar />
        <Error message={error} onRetry={handleRetry} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section id="dashboard">
        {/* Left Sidebar - Suggested Repositories */}
        <aside>
          <h3>🔥 Trending Repositories</h3>
          <div className="suggested-repos">
            {trendingRepos.length === 0 ? (
              <p className="no-repos">No repositories available</p>
            ) : (
              trendingRepos.map((repo) => (
                <div
                  key={repo._id}
                  className="repo-suggestion"
                  onClick={() => handleRepoClick(repo._id)}
                >
                  <div className="suggestion-header">
                    <Avatar
                      username={repo.owner?.username || "?"}
                      size="sm"
                    />
                    <div>
                      <h4>{repo.name}</h4>
                      <p style={{ fontSize: "11px", color: "#6e7681", margin: 0 }}>
                        by {repo.owner?.username || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <p className="repo-desc">{repo.description?.slice(0, 60)}</p>
                  <div style={{ display: "flex", gap: "8px", fontSize: "11px" }}>
                    <span>⭐ {repo.stars || 0}</span>
                    <span>{repo.issues?.length || 0} issues</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content - Your Repositories */}
        <main>
          <div className="main-header">
            <h2>📚 Your Repositories</h2>
            <button className="btn-create" onClick={handleCreateRepo}>
              ➕ New Repository
            </button>
          </div>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="🔍 Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <Loading message="Loading your repositories..." />
          ) : searchResults.length === 0 ? (
            <div className="no-repos-message">
              <p>📭 No repositories found</p>
              <button onClick={handleCreateRepo}>
                ✨ Create your first repository
              </button>
            </div>
          ) : (
            <div className="repo-grid">
              {searchResults.map((repo) => (
                <div
                  key={repo._id}
                  className="repo-card"
                  onClick={() => handleRepoClick(repo._id)}
                >
                  <div className="repo-card-header">
                    <h4>📦 {repo.name}</h4>
                    <span className={`badge ${repo.visibility ? "public" : "private"}`}>
                      {repo.visibility ? "🌐 Public" : "🔒 Private"}
                    </span>
                  </div>
                  <p className="repo-card-desc">
                    {repo.description || "No description provided"}
                  </p>
                  <div className="repo-card-footer">
                    <span className="repo-stars">⭐ {repo.stars || 0}</span>
                    <span className="repo-issues">
                      🔴 {repo.issues?.length || 0}
                    </span>
                    <span className="repo-prs">
                      🟣 {repo.pullRequests?.length || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar - More Suggested Repos */}
        <aside>
          <h3>💡 More to Explore</h3>
          <div className="suggested-repos">
            {suggestedRepositories.slice(0, 5).length === 0 ? (
              <p className="no-repos">No suggestions yet</p>
            ) : (
              suggestedRepositories.slice(0, 5).map((repo) => (
                <div
                  key={repo._id}
                  className="repo-suggestion"
                  onClick={() => handleRepoClick(repo._id)}
                >
                  <div className="suggestion-header">
                    <Avatar
                      username={repo.owner?.username || "?"}
                      size="sm"
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 2px 0" }}>{repo.name}</h4>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#6e7681",
                          margin: 0,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick(repo.owner?._id);
                        }}
                      >
                        @{repo.owner?.username || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <p className="repo-desc">
                    {repo.description?.slice(0, 50)}...
                  </p>
                  <span className={`visibility ${repo.visibility ? "public" : "private"}`}>
                    {repo.visibility ? "🌐 Public" : "🔒 Private"}
                  </span>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;