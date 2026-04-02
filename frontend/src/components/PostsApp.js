import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";
import MatchButton from "./MatchButton";

export default function PostsApp() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [currentRole, setCurrentRole] = useState("nanny");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [myPost, setMyPost] = useState(null);

  const [formData, setFormData] = useState({ title: "", content: "", role: "" });

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

  const loadMyPost = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${user.role}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        const mine = data.find((p) => p.author === user.username || p.user_id === user.id);
        setMyPost(mine || null);
      }
    } catch (err) {
      console.error("Could not load user's own post:", err);
    }
  };

  const handleSubmit = () => {
    const role = formData.role || (user ? user.role : "");
    if (!formData.title || !formData.content || !role) {
      showMessage("Please fill in all fields", "error");
      return;
    }
    fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...formData, role }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.message) {
          showMessage(result.message, "success");
          setFormData({ title: "", content: "", role: "" });
          loadPosts(currentRole);
          loadMyPost();
        } else {
          showMessage(result.error, "error");
        }
      })
      .catch((err) => showMessage("Error creating post: " + err.message, "error"));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    loadPosts(role);
  };

  useEffect(() => { loadPosts("nanny"); }, []);
  useEffect(() => { if (user) { loadMyPost(); } else { setMyPost(null); } }, [user]);

  const showMatchButton = (post) =>
    user && myPost && post.role !== user.role && post.author !== user.username;

  return (
    <div className="app-layout">
      <div className="page-header">
        <h1 className="page-title">Community Board</h1>
        <p className="page-subtitle">Connect with nannies and families in your area</p>
      </div>

      {/* Create Post */}
      {user ? (
        <div className="create-post-card">
          <h3>Post as {user.username} · {user.role}</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                placeholder="Give your post a title"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Role</label>
              <select
                value={formData.role || user.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-select"
              >
                <option value="nanny">Nanny</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-textarea"
              rows="4"
              placeholder="Share your experience, availability, or what you're looking for..."
            />
          </div>
          <button onClick={handleSubmit} className="btn btn-sage">Post</button>
        </div>
      ) : (
        <div className="create-post-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>
            <Link to="/login" style={{ color: "var(--sage)", fontWeight: 500 }}>Log in</Link>
            {" "}or{" "}
            <Link to="/register" style={{ color: "var(--sage)", fontWeight: 500 }}>Sign up</Link>
            {" "}to create a post
          </p>
        </div>
      )}

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${currentRole === "nanny" ? "active" : ""}`}
          onClick={() => handleRoleChange("nanny")}
        >
          Nanny Posts
        </button>
        <button
          className={`tab-btn ${currentRole === "parent" ? "active" : ""}`}
          onClick={() => handleRoleChange("parent")}
        >
          Parent Posts
        </button>
      </div>

      {/* Posts */}
      <div className="posts-list">
        {loading ? (
          <div className="state-loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="state-empty">
            <span className="state-empty-icon">📭</span>
            No posts yet for this role.
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-card-header">
                <h3 className="post-title">{post.title}</h3>
                <span className={`post-badge ${post.role}`}>{post.role}</span>
              </div>
              <div className="post-meta">
                By{" "}
                <Link to={`/profile/${post.author}`} className="author-link">
                  {post.author || post.role}
                </Link>
                {" "}· {new Date(post.created_at).toLocaleDateString()}
              </div>
              <div className="post-content">{post.content}</div>
              {showMatchButton(post) && (
                <div className="post-card-footer">
                  <MatchButton viewedPost={post} currentUserPost={myPost} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {user && !myPost && (
        <p style={{ textAlign: "center", color: "var(--text-light)", fontSize: "0.875rem", marginTop: "1.5rem" }}>
          Create a post above to unlock the ✨ Match feature.
        </p>
      )}
    </div>
  );
}
