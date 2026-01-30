import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';

function NannyBoard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchNannyPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts/nanny`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching nanny posts:', err);
      }
    };

    fetchNannyPosts();
  }, []);

  return (
    <div>
      <h2>Nanny Board</h2>
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

export default NannyBoard;
