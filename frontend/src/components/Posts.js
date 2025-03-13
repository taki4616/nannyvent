// src/components/Posts.js
import React from "react";
import "../index.css";

const Posts = () => {
  const samplePosts = [
    {
      id: 1,
      title: "Great Experience!",
      content: "Our nanny is amazing!",
      type: "success",
    },
    {
      id: 2,
      title: "Need a Nanny ASAP",
      content: "Looking for a full-time nanny.",
      type: "warning",
    },
    {
      id: 3,
      title: "Part-Time Help Needed",
      content: "We need after-school care.",
      type: "info",
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-primary">Community Posts</h2>
      {samplePosts.map((post) => (
        <div key={post.id} className={`alert alert-${post.type} mt-3`}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Posts;
