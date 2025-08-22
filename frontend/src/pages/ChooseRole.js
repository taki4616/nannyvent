// ChooseRole.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseRole.css"; // We'll create this file next for custom styling

const ChooseRole = () => {
  const navigate = useNavigate();

  const handleNannyClick = () => {
    navigate("/nanny-board");
  };

  const handleParentClick = () => {
    navigate("/parent-board");
  };

  return (
    <div className="choose-role-container">
      <h2>Who are you?</h2>
      <div className="role-buttons">
        <button className="role-button nanny" onClick={handleNannyClick}>
          NANNY
        </button>
        <button className="role-button parent" onClick={handleParentClick}>
          PARENT
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;
