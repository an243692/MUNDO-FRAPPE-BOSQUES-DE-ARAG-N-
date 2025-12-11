import React from "react";
import "./Logo.css";
import logoImage from "../pages/mundo frappe.png";

const Logo = ({ size = "medium" }) => {
  return (
    <div className={`logo-container logo-${size}`}>
      <img 
        src={logoImage} 
        alt="Mundo Frappe Logo" 
        className="logo-image"
      />
    </div>
  );
};

export default Logo;

