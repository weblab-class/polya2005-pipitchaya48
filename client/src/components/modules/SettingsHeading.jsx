import React from "react";
import { ChevronLeft } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const SettingsHeading = ({children}) => {
  return <div className="flex items-center w-full px-4 py-2">
    <Link to="/settings">
      <ChevronLeft />
    </Link>
    <h1 className="text-2xl text-center w-full">{children}</h1>
    <div className="w-6"></div>
  </div>;
};
