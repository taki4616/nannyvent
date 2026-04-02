import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";

export default function Profile() {
  const { username } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [saveMsg, setSaveMsg] = useState("");

  const isOwn = user?.username === username;

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetch(`${API_BASE_URL}/profile/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); }
        else { setProfile(data); setForm(data); }
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [username, token, navigate]);

  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.onload = () => {
      const size = 200;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      const scale = Math.max(size / img.width, size / img.height);
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      setForm((f) => ({ ...f, profile_picture: canvas.toDataURL("image/jpeg", 0.8) }));
    };
    img.src = URL.createObjectURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.profile);
      setForm(data.profile);
      setEditing(false);
      setSaveMsg("Profile saved!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  if (loading) return <div className="app-layout"><div className="state-loading">Loading profile...</div></div>;
  if (error) return <div className="app-layout"><div className="alert alert-error">{error}</div></div>;

  const isNanny = profile.role === "nanny";

  return (
    <div className="app-layout">
      <button className="btn btn-ghost" style={{ marginBottom: "1rem" }} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="profile-card">
        {/* Avatar + name */}
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <img
              src={editing ? form.profile_picture || "/default-avatar.png" : profile.profile_picture || "/default-avatar.png"}
              alt={profile.username}
              className="profile-avatar"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            {editing && (
              <label className="profile-avatar-upload">
                <input type="file" accept="image/*" onChange={handlePicture} style={{ display: "none" }} />
                Change photo
              </label>
            )}
          </div>
          <div className="profile-identity">
            <h1 className="profile-username">{profile.username}</h1>
            <span className={`post-badge ${profile.role}`}>{profile.role}</span>
            <p className="profile-meta">Member since {profile.member_since}</p>
            {(editing ? form.location : profile.location) && (
              <p className="profile-meta">📍 {editing ? form.location : profile.location}</p>
            )}
          </div>
          {isOwn && !editing && (
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          )}
        </div>

        {saveMsg && (
          <div className={`alert ${saveMsg.startsWith("Failed") ? "alert-error" : "alert-success"}`}>
            {saveMsg}
          </div>
        )}

        {/* Bio */}
        <div className="profile-section">
          <h3 className="profile-section-title">About</h3>
          {editing ? (
            <textarea
              className="form-textarea"
              value={form.bio || ""}
              onChange={update("bio")}
              placeholder="Tell families about yourself..."
              rows={4}
            />
          ) : (
            <p className="profile-bio">{profile.bio || <span style={{ color: "var(--text-light)" }}>No bio yet.</span>}</p>
          )}
        </div>

        {/* Location (edit only) */}
        {editing && (
          <div className="profile-section">
            <h3 className="profile-section-title">Location</h3>
            <input className="form-input" value={form.location || ""} onChange={update("location")} placeholder="City, State" />
          </div>
        )}

        {/* Role-specific fields */}
        <div className="profile-section">
          <h3 className="profile-section-title">{isNanny ? "Experience & Availability" : "Family Details"}</h3>
          {isNanny ? (
            <div className="profile-details">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Experience</span>
                {editing ? (
                  <input className="form-input" type="number" min="0" max="50"
                    value={form.experience_years || ""} onChange={update("experience_years")}
                    placeholder="Years" style={{ maxWidth: 100 }} />
                ) : (
                  <span>{profile.experience_years ? `${profile.experience_years} years` : "—"}</span>
                )}
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Availability</span>
                {editing ? (
                  <input className="form-input" value={form.availability || ""} onChange={update("availability")}
                    placeholder="e.g. Mon–Fri, Full-time" />
                ) : (
                  <span>{profile.availability || "—"}</span>
                )}
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Certifications</span>
                {editing ? (
                  <input className="form-input" value={form.certifications || ""} onChange={update("certifications")}
                    placeholder="e.g. CPR, First Aid" />
                ) : (
                  <span>{profile.certifications || "—"}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="profile-details">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Children</span>
                {editing ? (
                  <input className="form-input" value={form.children_info || ""} onChange={update("children_info")}
                    placeholder="e.g. 2 kids, ages 3 and 6" />
                ) : (
                  <span>{profile.children_info || "—"}</span>
                )}
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Schedule needed</span>
                {editing ? (
                  <input className="form-input" value={form.schedule_needed || ""} onChange={update("schedule_needed")}
                    placeholder="e.g. Mon–Fri, 8am–5pm" />
                ) : (
                  <span>{profile.schedule_needed || "—"}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Their post */}
        {profile.post && (
          <div className="profile-section">
            <h3 className="profile-section-title">Latest Post</h3>
            <div className="post-card" style={{ marginTop: 0 }}>
              <div className="post-card-header">
                <h3 className="post-title">{profile.post.title}</h3>
              </div>
              <div className="post-meta">{new Date(profile.post.created_at).toLocaleDateString()}</div>
              <div className="post-content">{profile.post.content}</div>
            </div>
          </div>
        )}

        {/* Save / Cancel */}
        {editing && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button className="btn btn-sage" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </button>
            <button className="btn btn-outline" onClick={() => { setEditing(false); setForm(profile); }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
