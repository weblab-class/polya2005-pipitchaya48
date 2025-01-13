import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "./NavBar.css";
import "../../utilities.css";
import { UserContext } from "../App";

const NavBar = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <nav className="NavBar-container">
      <div className="u-flex">[logo]</div>
      <div className="u-flex u-flex-spaceBetween">
        <div className="NavBar-linkContainer u-flex u-flex-gap-s">
          <NavLink to="/" className="NavBar-link">
            Home
          </NavLink>
          <NavLink to="/report/" className="NavBar-link">
            Report closed route
          </NavLink>
          <NavLink to="/settings/" className="NavBar-link">
            Settings
          </NavLink>
        </div>
        <div className="u-flex">
          {userId ? (
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
