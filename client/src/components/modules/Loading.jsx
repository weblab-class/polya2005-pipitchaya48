import React from "react";
import "./Loading.css";

export const Loading = ({ className }) => {
  return (
    <div className={className}>
      <div className="loader" />
    </div>
  );
};
