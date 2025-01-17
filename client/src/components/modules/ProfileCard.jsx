import React from "react";

import "../../utilities.css";

/**
 * A card that displays the user's profile picture and name
 * @param {Object} user the user to display profile
 */
export const ProfileCard = ({ user }) => {
  return (
    <div className="py-s flex flex-col items-center gap-l">
      <img
        src={user?.picture || "https://www.gravatar.com/avatar/"}
        className="block rounded-full h-32"
      />
      <h1 className="text-3xl">{user?.name || "Guest"}</h1>
    </div>
  );
};
