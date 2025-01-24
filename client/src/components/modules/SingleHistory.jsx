import React from "react";
import { ChevronRight } from "@mui/icons-material";

/**
 * @param {Date} timeOfLastQuery
 * @param {String} startName
 * @param {String} endName
 * @param {Function} onClick
 */
export const SingleHistory = (props) => {
  return (
    <div
      onClick={props.onClick}
      className="flex items-center justify-between px-s py-m hover:bg-gray-100 cursor-pointer"
    >
      <div> start to end </div> {/*to be changed*/}
      <div className="flex flex-row w-max">
        <div className="text-gray-400 px-m"> 3 days ago </div> {/*to be changed*/}
        <ChevronRight />
      </div>
    </div>
  );
};
