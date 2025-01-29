import React from "react";

import "../../utilities.css";
import timBeaver from "/img/Tim_front-half.svg";

/**
 * A card that displays the user's profile picture and name
 * @param {Object} user the user to display profile
 */
export const ProfileCard = ({ user }) => {
  return (
    <div className="py-s flex flex-col items-center gap-l">
      <img
        src={user?.picture || timBeaver}
        className="block rounded-full h-32"
      />
      <h1 className="text-3xl text-center">{user?.name || "Guest"}</h1>
    </div>
  );
};
