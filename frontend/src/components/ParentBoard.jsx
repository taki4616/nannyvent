import React, { useEffect, useState } from 'react';

function ParentBoard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchParentPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts/parent');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching parent posts:', err);
      }
    };

    fetchParentPosts();
  }, []);

  return (
    <div>
      <h2>Parent Board</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>Posted on: {new Date(post.created_at).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}

export default ParentBoard;
