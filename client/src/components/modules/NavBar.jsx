import React from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";
import "../../utilities.css";


const NavBar = () => {
  return (
    <nav className="flex flex-col w-full bg-mit-red p-m justify-around shadow">
      <div className="u-flex">[logo]</div>
      <div className="px-0 py-s flex gap-s">
        <NavLink to="/" className="text-white text no-underline p-s rounded-lg">Home</NavLink>
        <NavLink to="/report/" className="text-white text no-underline p-s rounded-lg">Report closed route</NavLink>
        <NavLink to="/settings/" className="text-white text no-underline p-s rounded-lg">Settings</NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
