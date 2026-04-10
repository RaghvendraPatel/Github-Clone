import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const profileUserId = userId || localStorage.getItem("userId");

  const [userDetails, setUserDetails] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [profileUserId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profileUserId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("Fetching profile for userId:", profileUserId);

      const response = await axios.get(
        `http://localhost:3002/userProfile/${profileUserId}`
      );

      if (!response.data) {
        setError("User not found");
        setLoading(false);
        return;
      }

      setUserDetails(response.data);

      // Fetch followers count - non-blocking
      try {
        const followersRes = await axios.get(
          `http://localhost:3002/followers/${profileUserId}`
        );
        setFollowerCount(followersRes.data?.length || 0);
      } catch (err) {
        console.error("Error fetching followers:", err);
        setFollowerCount(0);
      }

      // Fetch following count - non-blocking
      try {
        const followingRes = await axios.get(
          `http://localhost:3002/following/${profileUserId}`
        );
        setFollowingCount(followingRes.data?.length || 0);

        // Check if current user is following this user
        if (currentUser && currentUser !== profileUserId && followingRes.data) {
          setIsFollowing(
            followingRes.data.some(f => f._id === currentUser)
          );
        }
      } catch (err) {
        console.error("Error fetching following:", err);
        setFollowingCount(0);
      }
    } catch (err) {
      console.error("Error fetching user details: ", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load user profile";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      if (isFollowing) {
        await axios.post(
          `http://localhost:3002/unfollow/${currentUser}`,
          { unfollowId: profileUserId }
        );
      } else {
        await axios.post(
          `http://localhost:3002/follow/${currentUser}`,
          { followId: profileUserId }
        );
      }
      setIsFollowing(!isFollowing);
      fetchUserDetails();
    } catch (err) {
      console.error("Error updating follow status: ", err);
      setError("Failed to update follow status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px", textAlign: "center", color: "#8b949e" }}>
          Loading profile...
        </div>
      </>
    );
  }

  if (error || !userDetails) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px", textAlign: "center", color: "#f85149" }}>
          {error || "User not found"}
        </div>
      </>
    );
  }

  const isOwnProfile = currentUser === profileUserId;
  const userInitials = (userDetails.username || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Navbar />

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          {/* Avatar with user initials */}
          <div className="profile-image">
            <span className="profile-initial">{userInitials}</span>
          </div>

          {/* User Info */}
          <div className="user-name">
            <h2>{userDetails.username}</h2>
            <p>{userDetails.email}</p>
          </div>

          {/* Follow Button (hidden on own profile) */}
          {!isOwnProfile && (
            <button
              className={`follow-btn ${isFollowing ? "active" : ""}`}
              onClick={handleFollow}
            >
              {isFollowing ? "✓ Following" : "+ Follow"}
            </button>
          )}

          {/* Stats */}
          <div className="follower">
            <div className="follower-item">
              <span className="stat-count">{followerCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="follower-item">
              <span className="stat-count">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          {/* Logout button (own profile only) */}
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="logout-btn"
              style={{ marginTop: "24px", width: "100%" }}
            >
              🚪 Logout
            </button>
          )}
        </div>

        {/* Heat Map Section - Recent Contributions */}
        <div className="heat-map-section">
          <HeatMapProfile userId={profileUserId} />
        </div>
      </div>
    </>
  );
};

export default Profile;