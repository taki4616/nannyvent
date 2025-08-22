import React, { useState, useEffect } from "react";
import "./PostsApp.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export default function PostsApp() {
  const [posts, setPosts] = useState([]);
  const [currentRole, setCurrentRole] = useState("nanny");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    role: "",
  });

  // Load posts by role
  const loadPosts = async (role) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${role}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        showMessage("Error loading posts", "error");
      }
    } catch (error) {
      showMessage("Error loading posts: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.role) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message) {
          showMessage(result.message, "success");
          setFormData({ title: "", content: "", role: "" });
          loadPosts(currentRole);
        } else {
          showMessage(result.error, "error");
        }
      })
      .catch((error) => {
        showMessage("Error creating post: " + error.message, "error");
      });
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Handle role tab change
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    loadPosts(role);
  };

  // Load initial posts
  useEffect(() => {
    loadPosts("nanny");
  }, []);

  return (
    <div className="posts-container">
      <div className="posts-card">
        <h1 className="main-title">Nanny-Parent Communication</h1>

        {/* Create Post Form */}
        <div className="form-container">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="form-select"
              >
                <option value="">Select Role</option>
                <option value="nanny">Nanny</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="form-textarea"
              rows="4"
            />
          </div>

          <button onClick={handleSubmit} className="submit-btn">
            Create Post
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {/* Posts Section */}
        <div className="posts-section">
          <h2 className="posts-title">Posts</h2>

          {/* Role Tabs */}
          <div className="tabs-container">
            <button
              onClick={() => handleRoleChange("nanny")}
              className={`tab ${currentRole === "nanny" ? "tab-active" : ""}`}
            >
              Nanny Posts
            </button>
            <button
              onClick={() => handleRoleChange("parent")}
              className={`tab ${currentRole === "parent" ? "tab-active" : ""}`}
            >
              Parent Posts
            </button>
          </div>

          {/* Posts Display */}
          <div className="posts-list">
            {loading ? (
              <div className="loading">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="no-posts">No posts found for this role.</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-meta">
                    By: {post.role} |{" "}
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                  <div className="post-content">{post.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
