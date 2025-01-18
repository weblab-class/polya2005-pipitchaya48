import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../App";

import "./NavBar.css";
import "../../utilities.css";

const NavBar = () => {
  const {user, handleLogin} = useContext(UserContext);
  return (
    <nav className="flex flex-col w-full bg-mit-red p-m justify-around shadow">
      <div className="flex justify-between">
        <div>[logo]</div>
        {user?null:<GoogleLogin onSuccess={handleLogin} type="icon" size="medium"/>}
      </div>
      <div className="px-0 py-s flex gap-s">
        <NavLink to="/" className="text-white text no-underline p-s rounded-lg align-middle">
          Home
        </NavLink>
        <NavLink
          to="/report/"
          className="text-white text no-underline p-s rounded-lg align-middle tracking-tight"
        >
          Report closed route
        </NavLink>
        <NavLink
          to="/settings/"
          className="text-white text no-underline p-s rounded-lg align-middle"
        >
          Settings
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
