import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@mui/base";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import "./Home.css";
import "../../utilities.css";

export const Home = () => {
  return (
    <div className="Home-container">
      <h1 className="u-flex">
        MIT
        <br />
        Tunnel Navigator
      </h1>
      <Link to="/search" className="Home-searchContainer u-flex">
        <Input
          placeholder="Where are you going? (26-100, 32, etc.)"
          endAdornment={
            <InputAdornment>
              <SearchIcon />
            </InputAdornment>
          }
          className="Home-search u-flex"
        />
      </Link>
    </div>
  );
};
