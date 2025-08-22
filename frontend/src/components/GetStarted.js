// src/components/GetStarted.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./GetStarted.css";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="get-started-container">
      <h1 className="get-started-title">Who Are You?</h1>
      <div className="button-group">
        <button
          onClick={() => navigate("/nanny-board")}
          className="role-button nanny"
        >
          I’m a Nanny
        </button>
        <button
          onClick={() => navigate("/parent-board")}
          className="role-button parent"
        >
          I’m a Parent
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
