import React from "react";
import { ChevronRight } from "@mui/icons-material";
import { Switch } from "./Switch";

export const MenuList = ({ children }) => {
  if (!Array.isArray(children)) {
    return <div className="flex flex-col w-screen p-s">{children}</div>;
  }

  return (
    <div className="flex flex-col w-screen p-s">
      {children.map((child, index) => (
        <React.Fragment key={index}>
          {index === 0 || <hr />} {child}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * A list item for a menu
 *
 * @param {()=>void} onClick function to call when the item is clicked
 */
export const MenuListItem = ({ children, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-s hover:bg-gray-100 cursor-pointer"
    >
      <div className={className}>{children}</div>
      <ChevronRight />
    </div>
  );
};

export const MenuListSwitch = ({ children, onChange, className, check }) => {
  return (
    <div className="flex items-center justify-between p-s">
      <div className={className}>{children}</div>
      <Switch check={check} onChange={onChange} />
    </div>
  );
};
