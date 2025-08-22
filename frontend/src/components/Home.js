// src/components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

const Home = () => {
  const navigate = useNavigate(); // 👈 Hook for programmatic navigation

  const handleGetStarted = () => {
    navigate("/choose-role");
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary">Welcome to NannyVent</h1>
      <p className="text-secondary">A place where nannies can TALK! </p>
      <button className="btn btn-custom mt-3" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};
export default Home;
