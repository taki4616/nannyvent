// src/TestConnection.js
import React, { useState, useEffect } from "react";

const TestConnection = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Connection failed"));
  }, []);

  return (
    <div>
      <h1>Backend Connection Test</h1>
      <p>{message ? message : "Loading..."}</p>
    </div>
  );
};

export default TestConnection;
