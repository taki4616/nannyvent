// src/components/Home.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary">Welcome to NannyVent</h1>
      <p className="text-secondary">Find the perfect nanny for your family.</p>
      <button className="btn btn-custom mt-3">Get Started</button>
    </div>
  );
};

export default Home;
