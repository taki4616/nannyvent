import React, { useState } from "react";
import "./PostForm.css"; // Optional styling

const PostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content || !author) return;

    const newPost = {
      id: Date.now(),
      title,
      content,
      author,
    };

    onAddPost(newPost);
    setTitle("");
    setContent("");
    setAuthor("");
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name or nickname"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Submit Post</button>
    </form>
  );
};

export default PostForm;
