import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";
import "../issue/issue.css";

const AllIssues = () => {
  const { currentUser } = useAuth();
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [allIssues, filter, searchTerm]);

  const fetchAllIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3002/issue/all`);
      setAllIssues(response.data || []);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setAllIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = allIssues;

    // Filter by status
    if (filter !== "all") {
      filtered = filtered.filter(issue => issue.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        issue =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredIssues(filtered);
  };

  return (
    <>
      <Navbar />
      <div className="issue-container" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="issue-header">
          <h1>🔴 All Issues</h1>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="issue-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({allIssues.length})
          </button>
          <button
            className={`filter-btn ${filter === "open" ? "active" : ""}`}
            onClick={() => setFilter("open")}
          >
            Open ({allIssues.filter(i => i.status === "open").length})
          </button>
          <button
            className={`filter-btn ${filter === "closed" ? "active" : ""}`}
            onClick={() => setFilter("closed")}
          >
            Closed ({allIssues.filter(i => i.status === "closed").length})
          </button>
        </div>

        {/* Issues List */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#8b949e" }}>Loading issues...</p>
        ) : filteredIssues.length === 0 ? (
          <p style={{ textAlign: "center", color: "#8b949e" }}>
            {searchTerm ? "No issues matching your search" : "No issues found"}
          </p>
        ) : (
          <div className="issues-grid">
            {filteredIssues.map((issue) => (
              <div key={issue._id} className="issue-card">
                <div className="issue-card-header">
                  <h3>{issue.title}</h3>
                  <span
                    className={`status-badge ${issue.status}`}
                    style={{
                      backgroundColor: issue.status === "open" ? "#3fb950" : "#da3633",
                    }}
                  >
                    {issue.status}
                  </span>
                </div>
                <p className="issue-card-description">{issue.description}</p>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8b949e",
                    marginTop: "10px",
                    paddingTop: "10px",
                    borderTop: "1px solid #30363d",
                  }}
                >
                  by {issue.author || "Anonymous"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllIssues;
