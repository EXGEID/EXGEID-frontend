// src/components/MockModeBadge.jsx
import React from "react";

const MockModeBadge = () => {
  const badgeStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#ffcc00",
    color: "#000",
    fontWeight: "bold",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "6px",
    zIndex: 1000,
  };

  return <div style={badgeStyle}>🧪 Mock Mode Active</div>;
};

export default MockModeBadge;
