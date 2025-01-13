import React from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";
import "../../utilities.css";


const NavBar = () => {
  return (
    <nav className="NavBar-container">
      <div className="u-flex">[logo]</div>
      <div className="NavBar-linkContainer u-flex u-flex-gap-s">
        <NavLink to="/" className="NavBar-link">Home</NavLink>
        <NavLink to="/report/" className="NavBar-link">Report closed route</NavLink>
        <NavLink to="/settings/" className="NavBar-link">Settings</NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
