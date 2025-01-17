import React from "react";
import { ChevronRight } from "@mui/icons-material";

export const MenuList = ({ children }) => {
  return (
    <div className="flex flex-col w-screen p-s">
      {children.map((child, index) => (
        <>
          {index === 0 || <hr />} {child}
        </>
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
    <div onClick={onClick} className="flex items-center justify-between p-s hover:bg-gray-100 cursor-pointer">
      <div className={className}>{children}</div>
      <ChevronRight />
    </div>
  );
};
