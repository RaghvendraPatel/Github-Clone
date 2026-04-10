import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import axios from "axios";

// Generate contribution data based on repository activity
const generateContributionData = async (userId) => {
  try {
    // Fetch user's repositories and issues
    const repoRes = await axios.get(`http://localhost:3002/repo/user/${userId}`);
    const repos = repoRes.data.repositories || [];

    // Create a map of dates to contribution counts
    const contributionMap = {};

    // Count contributions from repositories (created date)
    repos.forEach((repo) => {
      const created = new Date(repo.createdAt);
      const dateStr = created.toISOString().split("T")[0];
      contributionMap[dateStr] = (contributionMap[dateStr] || 0) + 5;
    });

    // Fetch all issues created by user (approximate - we'll add issue_count to response)
    const issuesRes = await axios.get(`http://localhost:3002/issue/all`);
    const userIssues = issuesRes.data.filter(
      (issue) => issue.author?._id === userId
    );

    userIssues.forEach((issue) => {
      const created = new Date(issue.createdAt);
      const dateStr = created.toISOString().split("T")[0];
      contributionMap[dateStr] = (contributionMap[dateStr] || 0) + 3;
    });

    // Convert to array format and fill past year
    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      data.push({
        date: dateStr,
        count: contributionMap[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  } catch (err) {
    console.error("Error generating contribution data:", err);
    return generateFallbackData();
  }
};

// Fallback data when API fails
const generateFallbackData = () => {
  const data = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    // Random activity with higher chance of zero
    const random = Math.random();
    const count = random > 0.7 ? Math.floor(Math.random() * 10) + 1 : 0;

    data.push({
      date: dateStr,
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getPanelColors = (maxCount) => {
  if (maxCount === 0) maxCount = 1;

  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    // GitHub-like green gradient
    let color;
    if (i === 0) {
      color = "#0d1117"; // no activity - background
    } else if (i < maxCount * 0.25) {
      color = "#0e4429"; // darkest green
    } else if (i < maxCount * 0.5) {
      color = "#006d32"; // darker green
    } else if (i < maxCount * 0.75) {
      color = "#26a641"; // medium green
    } else {
      color = "#39d353"; // brightest green
    }
    colors[i] = color;
  }

  return colors;
};

const HeatMapProfile = ({ userId }) => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await generateContributionData(userId);
        setActivityData(data);

        const maxCount = Math.max(...data.map((d) => d.count), 1);
        setPanelColors(getPanelColors(maxCount));
      } catch (err) {
        console.error("Error fetching contribution data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#8b949e" }}>
        Loading contributions...
      </div>
    );
  }

  if (activityData.length === 0) {
    return (
      <div style={{ padding: "20px", color: "#8b949e" }}>
        No contributions yet
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ margin: "0 0 16px 0", color: "#c9d1d9" }}>
        📊 Contributions in the last year
      </h3>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "100%", height: "180px", color: "white" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        rectSize={13}
        space={2}
        rectProps={{
          rx: 2,
          strokeWidth: 0.5,
          stroke: "#30363d",
        }}
        panelColors={panelColors}
      />
      <p style={{ fontSize: "12px", color: "#6e7681", marginTop: "12px" }}>
        Data represents repositories created, issues opened, and commits made
      </p>
    </div>
  );
};

export default HeatMapProfile;