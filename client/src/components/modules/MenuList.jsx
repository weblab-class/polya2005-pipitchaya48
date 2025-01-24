import React from "react";
import { CheckOutlined, ChevronRight } from "@mui/icons-material";
import { Switch } from "./Switch";
import { clsx } from "clsx";
import { Menu } from "@mui/base";

export const MenuList = ({ children }) => {
  if (!Array.isArray(children)) {
    return <div className="flex flex-col w-screen p-s max-h-full overflow-auto">{children}</div>;
  }

  return (
    <div className="flex flex-col w-screen p-s max-h-full overflow-scroll">
      {children.map((child, index) => (
        <React.Fragment key={index}>
          {index === 0 || <hr />} {child}
        </React.Fragment>
      ))}
    </div>
  );
};

export const MenuItem = ({ children, onClick, className, rightAdornment }) => {
  return (
    <div
      onClick={onClick || (() => {})}
      className={clsx(
        "flex items-center justify-between p-s",
        onClick && "hover:bg-gray-100 cursor-pointer",
        className
      )}
    >
      {children}
      {rightAdornment}
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
    <MenuItem onClick={onClick} rightAdornment={<ChevronRight />}>
      <div className={className}>{children}</div>
    </MenuItem>
  );
};

export const MenuListSwitch = ({ children, onChange, className, checked }) => {
  return (
    <MenuItem rightAdornment={<Switch checked={checked} onChange={onChange} />}>
      <div className={className}>{children}</div>
    </MenuItem>
  );
};
